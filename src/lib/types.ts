import type { ReactNode } from 'react';

export type TutorialId = 'git-basics';

export interface File {
  id: string;
  name: string;
  content: string;
  status: 'untracked' | 'modified' | 'staged' | 'unmodified';
}

export interface Directory {
  id: string;
  name: string;
  files: File[];
  dirs: Directory[];
}

export interface Commit {
  id: string;
  shortId: string;
  message: string;
  timestamp: number;
}

export interface TerminalLine {
  id: number;
  type: 'command' | 'output';
  content: React.ReactNode;
}

export interface TutorialState {
  tutorialId: TutorialId;
  currentStep: number;
  repoInitialized: boolean;
  fileSystem: Directory;
  commits: Commit[];
  terminalHistory: TerminalLine[];
  remoteUrl: string | null;
  completedSteps: Set<number>;
}

export type TutorialStep = {
  id: number;
  title: string;
  description: React.ReactNode;
  uiAction?: {
    label: string;
    actionType: string;
    payload?: any;
  };
  commandToProceed?: RegExp;
  isCompleted: (state: TutorialState) => boolean;
};
