"use client";

import React, { createContext, useContext, useReducer, useEffect, useCallback, useMemo } from 'react';
import type { TutorialState, TutorialStep, TerminalLine, TutorialId, File, Directory } from '@/lib/types';
import { tutorials } from '@/lib/tutorials';
import { nanoid } from 'nanoid';
import { useToast } from "@/hooks/use-toast";

type TutorialAction =
  | { type: 'SET_STEP'; payload: number }
  | { type: 'RESET' }
  | { type: 'PROCESS_COMMAND'; payload: string }
  | { type: 'CREATE_FILE'; payload: { name: string, content: string } }
  | { type: 'MODIFY_FILE'; payload: { name: string, content: string } };

const initialState: TutorialState = {
  tutorialId: 'git-basics',
  currentStep: 0,
  repoInitialized: false,
  fileSystem: { id: 'root', name: 'gitjourney-project', files: [], dirs: [] },
  commits: [],
  terminalHistory: [{id: 0, type: 'output', content: 'Welcome to the GitJourney terminal!'}],
  remoteUrl: null,
  completedSteps: new Set(),
};

// =================================================================
// File System Reducer Helpers
// =================================================================

const getAllFiles = (dir: Directory, prefix = ''): { file: File, path: string }[] => {
    let files: { file: File, path: string }[] = [];
    files = files.concat(dir.files.map(f => ({ file: f, path: prefix + f.name })));
    dir.dirs.forEach(subDir => {
        files = files.concat(getAllFiles(subDir, `${prefix}${subDir.name}/`));
    });
    return files;
};

const findFileByPath = (fs: Directory, path: string): File | undefined => {
    const parts = path.split('/').filter(Boolean);
    const fileName = parts.pop();
    if (!fileName) return undefined;

    let currentDir: Directory | undefined = fs;
    for (const part of parts) {
        currentDir = currentDir?.dirs.find(d => d.name === part);
    }
    return currentDir?.files.find(f => f.name === fileName);
};

const updateFileSystem = (
    dir: Directory, 
    path: string, 
    updateFn: (file: File) => File
): Directory => {
    const pathParts = path.split('/');
    const name = pathParts.pop()!;

    if (pathParts.length === 0) { // File is in the current directory
        return {
            ...dir,
            files: dir.files.map(f => f.name === name ? updateFn(f) : f)
        };
    }

    const subDirName = pathParts.shift()!;
    return {
        ...dir,
        dirs: dir.dirs.map(d => d.name === subDirName 
            ? updateFileSystem(d, pathParts.join('/'), updateFn) 
            : d
        )
    };
};

const stageAllFiles = (dir: Directory): Directory => {
    return {
        ...dir,
        files: dir.files.map(f => (f.status === 'modified' || f.status === 'untracked') ? { ...f, status: 'staged' } : f),
        dirs: dir.dirs.map(stageAllFiles)
    };
};

const commitStagedFiles = (dir: Directory): Directory => {
    return {
        ...dir,
        files: dir.files.map(f => f.status === 'staged' ? { ...f, status: 'unmodified' } : f),
        dirs: dir.dirs.map(commitStagedFiles)
    };
}


// =================================================================
// Reducer
// =================================================================

const reducer = (state: TutorialState, action: TutorialAction): TutorialState => {
  switch (action.type) {
    case 'SET_STEP': {
      const newCompletedSteps = new Set(state.completedSteps);
      if (action.payload > state.currentStep) {
        newCompletedSteps.add(state.currentStep);
      }
      return { ...state, currentStep: action.payload, completedSteps: newCompletedSteps };
    }
    
    case 'PROCESS_COMMAND': {
      const command = action.payload.trim();
      let newState = { ...state, terminalHistory: [...state.terminalHistory, { id: Date.now(), type: 'command' as 'command', content: command }] };
      let output: React.ReactNode = `Command not recognized: ${command}`;

      if (/^git init$/.test(command)) {
        newState.repoInitialized = true;
        output = 'Initialized empty Git repository in /gitjourney-project/.git/';
      } else if (/^touch (.*)$/.test(command)) {
        const match = command.match(/^touch (.*)$/);
        const path = match ? match[1] : '';
        const parts = path.split('/').filter(p => p);
        const fileName = parts.pop();
        
        output = ''; // No output on success
        if (!fileName) {
            output = 'touch: missing file operand';
        } else if (findFileByPath(newState.fileSystem, path)) {
            // File exists, do nothing (like real touch)
        } else {
            const newFile = { id: nanoid(), name: fileName, content: '', status: 'untracked' as 'untracked' };
            if (parts.length === 0) { // root
                newState.fileSystem = { ...newState.fileSystem, files: [...newState.fileSystem.files, newFile] };
            } else if (parts.length === 1) { // 1 level deep
                const dirName = parts[0];
                const dirExists = newState.fileSystem.dirs.some(d => d.name === dirName);
                if (dirExists) {
                    newState.fileSystem = {
                        ...newState.fileSystem,
                        dirs: newState.fileSystem.dirs.map(d => 
                            d.name === dirName ? { ...d, files: [...d.files, newFile] } : d
                        )
                    }
                } else {
                    output = `touch: cannot touch '${path}': No such file or directory`;
                }
            } else {
                output = `touch: cannot touch '${path}': No such file or directory`;
            }
        }
      } else if (/^mkdir (.*)$/.test(command)) {
        const match = command.match(/^mkdir (.*)$/);
        const dirName = match ? match[1].split('/')[0] : '';
        output = ''; // No output on success
        if (!dirName || dirName.includes('/')) {
            output = 'mkdir: Invalid directory name. Only top-level directories are supported.';
        } else if (newState.fileSystem.dirs.some(d => d.name === dirName) || newState.fileSystem.files.some(f => f.name === dirName)) {
            output = `mkdir: cannot create directory ‘${dirName}’: File exists`;
        } else {
            const newDir: Directory = { id: nanoid(), name: dirName, files: [], dirs: [] };
            newState.fileSystem = { ...newState.fileSystem, dirs: [...newState.fileSystem.dirs, newDir] };
        }
      } else if (/^git status$/.test(command)) {
         if (!newState.repoInitialized) {
            output = 'fatal: not a git repository (or any of the parent directories): .git';
         } else {
            const allFiles = getAllFiles(newState.fileSystem);
            const staged = allFiles.filter(({file}) => file.status === 'staged');
            const modified = allFiles.filter(({file}) => file.status === 'modified');
            const untracked = allFiles.filter(({file}) => file.status === 'untracked');
            let statusOutput = 'On branch main\n\n';

            if (newState.commits.length === 0) {
              statusOutput += 'No commits yet\n\n';
            }

            if (staged.length > 0) {
               statusOutput += 'Changes to be committed:\n';
               staged.forEach(({path}) => statusOutput += `\tnew file:   ${path}\n`);
               statusOutput += '\n';
            }
            if (modified.length > 0) {
              statusOutput += 'Changes not staged for commit:\n';
              modified.forEach(({path}) => statusOutput += `\tmodified:   ${path}\n`);
              statusOutput += '\n';
            }
            if (untracked.length > 0) {
               statusOutput += 'Untracked files:\n';
               untracked.forEach(({path}) => statusOutput += `\t${path}\n`);
               statusOutput += '\n';
            }
            if (staged.length === 0 && modified.length === 0 && untracked.length === 0) {
              statusOutput += 'nothing to commit, working tree clean';
            }
            output = statusOutput;
         }
      } else if (/^git add (.*)$/.test(command)) {
        const match = command.match(/^git add (.*)$/);
        const pathToAdd = match ? match[1] : '';
        output = ''; // No output on success
        
        if (pathToAdd === '.') {
            newState.fileSystem = stageAllFiles(newState.fileSystem);
        } else {
            const file = findFileByPath(newState.fileSystem, pathToAdd);
            if (file && (file.status === 'untracked' || file.status === 'modified')) {
                newState.fileSystem = updateFileSystem(newState.fileSystem, pathToAdd, (f) => ({...f, status: 'staged'}));
            } else if (!file) {
                output = `fatal: pathspec '${pathToAdd}' did not match any files`;
            }
        }
      } else if (/^git commit -m "(.*)"$/.test(command)) {
        const allFiles = getAllFiles(newState.fileSystem);
        const stagedFiles = allFiles.filter(f => f.file.status === 'staged');

        if (stagedFiles.length === 0) {
            output = 'On branch main\n' + (newState.commits.length === 0 ? 'No commits yet\n' : '') + 'nothing to commit, working tree clean';
        } else {
            const match = command.match(/^git commit -m "(.*)"$/);
            const message = match ? match[1] : 'Commit';
            const id = nanoid(40);
            const newCommit = { id, shortId: id.substring(0, 7), message, timestamp: Date.now() };
            const isRoot = state.commits.length === 0;

            newState.commits = [newCommit, ...newState.commits];
            newState.fileSystem = commitStagedFiles(newState.fileSystem);
            output = `[main${isRoot ? ' (root-commit)' : ''} ${newCommit.shortId}] ${message}\n ${stagedFiles.length} file changed.`;
        }
      } else if (/^git remote add origin (.*)$/.test(command)) {
        const match = command.match(/^git remote add origin (.*)$/);
        newState.remoteUrl = match ? match[1] : null;
        output = '';
      } else if (/^git push -u origin main$/.test(command)) {
        if (!newState.remoteUrl) {
            output = 'fatal: \'origin\' does not appear to be a git repository';
        } else {
            output = `Enumerating objects: 3, done.
Counting objects: 100% (3/3), done.
Writing objects: 100% (3/3), 241 bytes | 241.00 KiB/s, done.
Total 3 (delta 0), reused 0 (delta 0), pack-reused 0
To ${newState.remoteUrl}
 * [new branch]      main -> main
Branch 'main' set up to track remote branch 'main' from 'origin'.`;
        }
      }

      return { ...newState, terminalHistory: [...newState.terminalHistory, { id: Date.now()+1, type: 'output', content: output }] };
    }

    case 'CREATE_FILE': {
        const path = action.payload.name;
        if (findFileByPath(state.fileSystem, path)) return state;

        const newFile = {
            id: nanoid(),
            name: path, // Assuming root for simplicity here.
            content: action.payload.content,
            status: 'untracked' as 'untracked'
        };

        return { ...state, fileSystem: {...state.fileSystem, files: [...state.fileSystem.files, newFile] } };
    }
    
    case 'MODIFY_FILE': {
      const path = action.payload.name;
      if (!findFileByPath(state.fileSystem, path)) return state;

      const newFileSystem = updateFileSystem(state.fileSystem, path, (file) => ({
          ...file,
          content: action.payload.content,
          status: 'modified'
      }));

      return { ...state, fileSystem: newFileSystem };
    }

    case 'RESET':
      return { 
        ...initialState, 
        tutorialId: state.tutorialId,
        terminalHistory: [{id: 0, type: 'output', content: 'Tutorial reset. Welcome back!'}] 
      };
    
    default:
      return state;
  }
};

type TutorialContextType = {
  state: TutorialState;
  dispatch: React.Dispatch<TutorialAction>;
  processCommand: (command: string) => void;
  currentStepData: TutorialStep;
  resetTutorial: () => void;
};

const TutorialContext = createContext<TutorialContextType | undefined>(undefined);

export const TutorialProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { toast } = useToast();

  const activeTutorialSteps = useMemo(() => tutorials[state.tutorialId].steps, [state.tutorialId]);

  const processCommand = (command: string) => {
    dispatch({ type: 'PROCESS_COMMAND', payload: command });
  };
  
  const currentStepData = useMemo(() => activeTutorialSteps[state.currentStep], [state.currentStep, activeTutorialSteps]);

  const checkStepCompletion = useCallback(() => {
    if (currentStepData.isCompleted(state) && state.currentStep < activeTutorialSteps.length - 1) {
      toast({
        title: "Step Complete!",
        description: `You've completed: "${currentStepData.title}"`,
      });
      dispatch({ type: 'SET_STEP', payload: state.currentStep + 1 });
    }
  }, [state, currentStepData, toast, activeTutorialSteps.length]);

  useEffect(() => {
    checkStepCompletion();
  }, [state, checkStepCompletion]);

  useEffect(() => {
    // For simplicity, we don't persist state across reloads when multiple tutorials exist.
    // The state is complex to reconstruct.
  }, []);

  const resetTutorial = () => {
    dispatch({ type: 'RESET' });
  };

  return (
    <TutorialContext.Provider value={{ state, dispatch, processCommand, currentStepData, resetTutorial }}>
      {children}
    </TutorialContext.Provider>
  );
};

export const useTutorial = () => {
  const context = useContext(TutorialContext);
  if (context === undefined) {
    throw new Error('useTutorial must be used within a TutorialProvider');
  }
  return context;
};
