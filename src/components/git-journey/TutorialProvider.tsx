"use client";

import React, { createContext, useContext, useReducer, useEffect, useCallback, useMemo } from 'react';
import type { TutorialState, TutorialStep, TerminalLine } from '@/lib/types';
import { tutorialSteps } from '@/lib/tutorial-steps';
import { nanoid } from 'nanoid';
import { useToast } from "@/hooks/use-toast";

type TutorialAction =
  | { type: 'SET_STEP'; payload: number }
  | { type: 'RESET' }
  | { type: 'PROCESS_COMMAND'; payload: string }
  | { type: 'CREATE_FILE'; payload: { name: string, content: string } };

const initialState: TutorialState = {
  currentStep: 0,
  repoInitialized: false,
  fileSystem: { id: 'root', name: 'gitjourney-project', files: [], dirs: [] },
  commits: [],
  terminalHistory: [{id: 0, type: 'output', content: 'Welcome to the GitJourney terminal!'}],
  remoteUrl: null,
  completedSteps: new Set(),
};

const findFile = (state: TutorialState, name: string) => state.fileSystem.files.find(f => f.name === name);

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
      } else if (/^git status$/.test(command)) {
         if (!newState.repoInitialized) {
            output = 'fatal: not a git repository (or any of the parent directories): .git';
         } else {
            const staged = newState.fileSystem.files.filter(f => f.status === 'staged');
            const modified = newState.fileSystem.files.filter(f => f.status === 'modified');
            const untracked = newState.fileSystem.files.filter(f => f.status === 'untracked');
            let statusOutput = 'On branch main\n\nNo commits yet\n\n';
            if (staged.length > 0) {
               statusOutput += 'Changes to be committed:\n';
               staged.forEach(f => statusOutput += `\tnew file:   ${f.name}\n`);
            }
            if (untracked.length > 0) {
               statusOutput += '\nUntracked files:\n';
               untracked.forEach(f => statusOutput += `\t${f.name}\n`);
            }
            output = statusOutput;
         }
      } else if (/^git add (.*)$/.test(command)) {
        const match = command.match(/^git add (.*)$/);
        const fileToAdd = match ? match[1] : '';
        if (fileToAdd === '.' || findFile(state, fileToAdd)) {
            newState.fileSystem = {
                ...newState.fileSystem,
                files: newState.fileSystem.files.map(f => f.status === 'untracked' || f.status === 'modified' ? { ...f, status: 'staged' } : f)
            };
            output = '';
        } else {
            output = `fatal: pathspec '${fileToAdd}' did not match any files`;
        }
      } else if (/^git commit -m "(.*)"$/.test(command)) {
        const stagedFiles = newState.fileSystem.files.filter(f => f.status === 'staged');
        if (stagedFiles.length === 0) {
            output = 'On branch main\nNo commits yet\nnothing to commit, working tree clean';
        } else {
            const match = command.match(/^git commit -m "(.*)"$/);
            const message = match ? match[1] : 'Commit';
            const id = nanoid(40);
            const newCommit = { id, shortId: id.substring(0, 7), message, timestamp: Date.now() };
            newState.commits = [newCommit, ...newState.commits];
            newState.fileSystem = {
                ...newState.fileSystem,
                files: newState.fileSystem.files.map(f => f.status === 'staged' ? { ...f, status: 'unmodified' } : f)
            };
            output = `[main (root-commit) ${newCommit.shortId}] ${message}\n 1 file changed, 1 insertion(+)
 create mode 100644 README.md`;
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
        const fileExists = state.fileSystem.files.some(f => f.name === action.payload.name);
        if (fileExists) return state;

        const newFile = {
            id: nanoid(),
            name: action.payload.name,
            content: action.payload.content,
            status: 'untracked' as 'untracked'
        };

        const newFileSystem = {
            ...state.fileSystem,
            files: [...state.fileSystem.files, newFile]
        };

        return { ...state, fileSystem: newFileSystem };
    }

    case 'RESET':
      return { ...initialState, terminalHistory: [{id: 0, type: 'output', content: 'Tutorial reset. Welcome back!'}] };
    
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

  const processCommand = (command: string) => {
    dispatch({ type: 'PROCESS_COMMAND', payload: command });
  };
  
  const currentStepData = useMemo(() => tutorialSteps[state.currentStep], [state.currentStep]);

  const checkStepCompletion = useCallback(() => {
    if (currentStepData.isCompleted(state) && state.currentStep < tutorialSteps.length - 1) {
      toast({
        title: "Step Complete!",
        description: `You've completed: "${currentStepData.title}"`,
      });
      dispatch({ type: 'SET_STEP', payload: state.currentStep + 1 });
    }
  }, [state, currentStepData, toast]);

  useEffect(() => {
    checkStepCompletion();
  }, [state, checkStepCompletion]);

  useEffect(() => {
    const savedStep = localStorage.getItem('gitjourney_step');
    if (savedStep && parseInt(savedStep, 10) > 0) {
      // This is complex, would need to reconstruct state up to that step.
      // For now, we always start at 0 but could implement this later.
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('gitjourney_step', state.currentStep.toString());
  }, [state.currentStep]);

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
