import { tutorialSteps as gitBasicsSteps } from './tutorial-steps';
import { portfolioTutorialSteps } from './portfolio-tutorial-steps';
import type { TutorialStep, TutorialId } from './types';

type Tutorial = {
  name: string;
  steps: TutorialStep[];
};

export const tutorials: Record<TutorialId, Tutorial> = {
  'git-basics': {
    name: 'Git Basics: The Core Workflow',
    steps: gitBasicsSteps,
  },
  'portfolio-github': {
    name: 'Portfolio with GitHub Pages',
    steps: portfolioTutorialSteps,
  }
};
