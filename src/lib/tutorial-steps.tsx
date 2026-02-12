import type { TutorialStep, TutorialState } from './types';
import { GitGraph, Github, Terminal } from 'lucide-react';

const Code = ({ children }: { children: React.ReactNode }) => (
  <code className="bg-muted text-foreground font-code px-1 py-0.5 rounded text-sm">
    {children}
  </code>
);

export const tutorialSteps: TutorialStep[] = [
  {
    id: 0,
    title: "Welcome to GitJourney!",
    description: (
      <div className="space-y-4">
        <p>
          Welcome to your interactive guide to mastering Git and GitHub! This tutorial will walk you through the essential commands and concepts, from creating a repository to pushing your code to a remote server.
        </p>
        <p>
          On the right, you'll see your interactive space: a file system visualizer and a simulated terminal. You'll type commands into the terminal just like a real developer.
        </p>
        <p>
          Let's start by initializing a new Git repository in our project folder. Type the following command into the terminal and press Enter:
        </p>
        <div className="bg-muted p-2 rounded-md">
          <pre className="font-code text-sm">git init</pre>
        </div>
      </div>
    ),
    commandToProceed: /^git init$/,
    isCompleted: (state: TutorialState) => state.repoInitialized,
  },
  {
    id: 1,
    title: "Repository Initialized",
    description: (
      <div className="space-y-4">
        <p>
          Great! You've just created a new Git repository. A hidden directory named <Code>.git</Code> has been created in your project folder. This is where Git stores all the metadata and history for your project.
        </p>
        <p>
          Notice the <GitGraph className="inline-block h-4 w-4 text-primary" /> icon appeared in the file visualizer? That indicates this is now a Git repository.
        </p>
        <p>
          Next, let's create a file. You can do this by clicking the "Create File" button in the File System panel. Let's create a file named <Code>README.md</Code>.
        </p>
      </div>
    ),
    uiAction: {
      label: 'Create File',
      actionType: 'CREATE_FILE',
      payload: { name: 'README.md', content: '# My Project' },
    },
    isCompleted: (state: TutorialState) => state.fileSystem.files.some(f => f.name === 'README.md'),
  },
  {
    id: 2,
    title: "Checking the Status",
    description: (
      <div className="space-y-4">
        <p>
          You've created <Code>README.md</Code>. See how it's colored differently and marked with a 'U' for untracked? This means Git sees the new file but isn't tracking changes to it yet.
        </p>
        <p>
          To see what Git knows about the state of your project, use the <Code>git status</Code> command. It's one of the most common commands you'll use.
        </p>
        <div className="bg-muted p-2 rounded-md">
          <pre className="font-code text-sm">git status</pre>
        </div>
      </div>
    ),
    commandToProceed: /^git status$/,
    isCompleted: (state: TutorialState) => state.terminalHistory.some(l => l.type === 'command' && l.content === 'git status'),
  },
  {
    id: 3,
    title: "Staging Changes",
    description: (
      <div className="space-y-4">
        <p>
          The status shows one untracked file. Before we can save a version of our project (a "commit"), we need to tell Git exactly which changes we want to include. This is called "staging".
        </p>
        <p>
          We use the <Code>git add</Code> command to stage changes. You can add files one by one, or use a period (<Code>.</Code>) to stage all new and modified files in the current directory.
        </p>
        <p>Let's stage our new file:</p>
        <div className="bg-muted p-2 rounded-md">
          <pre className="font-code text-sm">git add README.md</pre>
        </div>
      </div>
    ),
    commandToProceed: /^git add (README.md|\.)$/,
    isCompleted: (state: TutorialState) => state.fileSystem.files.some(f => f.name === 'README.md' && f.status === 'staged'),
  },
  {
    id: 4,
    title: "Committing Changes",
    description: (
      <div className="space-y-4">
        <p>
          The file is now staged! It's marked with an 'S' and shown in green. This means it's ready to be included in our next commit.
        </p>
        <p>
          A commit is like a snapshot of your staged changes at a specific point in time. Every commit has a unique ID and a message describing the changes.
        </p>
        <p>
          Let's make our first commit. Use the <Code>git commit</Code> command with the <Code>-m</Code> flag to provide a message.
        </p>
        <div className="bg-muted p-2 rounded-md">
          <pre className="font-code text-sm">git commit -m "Initial commit"</pre>
        </div>
      </div>
    ),
    commandToProceed: /^git commit -m ".*"$/,
    isCompleted: (state: TutorialState) => state.commits.length > 0,
  },
  {
    id: 5,
    title: "First Commit Created!",
    description: (
      <div className="space-y-4">
        <p>
          Congratulations! You've made your first commit. Look at the "Commit History" panel. You can see your new commit there, with its unique ID and message.
        </p>
        <p>
          Also, notice <Code>README.md</Code> is back to its normal color. It's now "unmodified" because its current state matches the last snapshot Git saved.
        </p>
        <p>
          Now, let's connect our local repository to a remote repository on GitHub to share and back up our work.
        </p>
      </div>
    ),
    isCompleted: (state: TutorialState) => state.commits.length > 0,
  },
  {
    id: 6,
    title: "Connecting to GitHub",
    description: (
      <div className="space-y-4">
        <p>
          So far, all our work is on our local machine. To collaborate or back up your code, you need to "push" it to a remote service like GitHub.
        </p>
        <p className="flex items-center gap-2">
          First, you would go to GitHub.com <Github className="inline h-4 w-4" /> and create a new, empty repository (don't initialize it with a README).
        </p>
        <p>
          Once created, GitHub gives you a URL for your new repository. It looks something like <Code>https://github.com/your-username/your-repo.git</Code>.
        </p>
        <p>
          We use the <Code>git remote add</Code> command to link our local repo to that URL. Let's simulate this by adding a remote named "origin":
        </p>
        <div className="bg-muted p-2 rounded-md">
          <pre className="font-code text-sm">git remote add origin https://github.com/git-journey/demo.git</pre>
        </div>
      </div>
    ),
    commandToProceed: /^git remote add origin .*/,
    isCompleted: (state: TutorialState) => state.remoteUrl !== null,
  },
  {
    id: 7,
    title: "Pushing to Remote",
    description: (
      <div className="space-y-4">
        <p>
          The remote is now configured! The final step is to "push" our local commits to the remote repository on GitHub.
        </p>
        <p>
          The command is <Code>git push</Code>. The <Code>-u</Code> flag sets the remote "origin" as the default upstream for the current branch, so next time you can just type <Code>git push</Code>. We'll push our `main` branch.
        </p>
        <div className="bg-muted p-2 rounded-md">
          <pre className="font-code text-sm">git push -u origin main</pre>
        </div>
      </div>
    ),
    commandToProceed: /^git push -u origin main$/,
    isCompleted: (state: TutorialState) => state.terminalHistory.some(l => l.type === 'command' && l.content === 'git push -u origin main'),
  },
  {
    id: 8,
    title: 'Congratulations!',
    description: (
      <div className="space-y-4">
        <p>You've completed the basic Git workflow! You have:</p>
        <ul className="list-disc list-inside space-y-2">
          <li>Initialized a local Git repository.</li>
          <li>Created a file and checked its status.</li>
          <li>Staged and committed your changes.</li>
          <li>Connected your local repo to a remote on GitHub.</li>
          <li>Pushed your commits to the remote repository.</li>
        </ul>
        <p>
          This is the fundamental cycle you'll use constantly as a developer. Feel free to use the "Reset Progress" button to start over, or use the AI Explainer if you have any questions!
        </p>
      </div>
    ),
    isCompleted: (state: TutorialState) => false, // Never auto-completed
  },
];
