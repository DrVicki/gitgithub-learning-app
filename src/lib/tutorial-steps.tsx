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
    title: "Creating a File",
    description: (
      <div className="space-y-4">
        <p>
          Great! You've just created a new Git repository. A hidden directory named <Code>.git</Code> has been created, and Git is now tracking this project.
        </p>
        <p>
          Next, let's create our first file. We'll use the <Code>touch</Code> command, which creates a new, empty file. Let's create a file named <Code>README.md</Code>.
        </p>
        <div className="bg-muted p-2 rounded-md">
          <pre className="font-code text-sm">touch README.md</pre>
        </div>
      </div>
    ),
    commandToProceed: /^touch README.md$/,
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
    isCompleted: (state: TutorialState) => state.terminalHistory.some(l => l.type === 'command' && l.content === 'git status' && state.currentStep === 2),
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
    title: "Modifying a File",
    description: (
      <div className="space-y-4">
        <p>
          Congratulations! You've made your first commit. Look at the "Commit History" panel. You can see your new commit there.
        </p>
        <p>
          Now that you've saved a version of your project, let's see what happens when you modify a file. Click the button below to update the content of your <Code>README.md</Code> file.
        </p>
      </div>
    ),
    uiAction: {
      label: 'Modify README.md',
      actionType: 'MODIFY_FILE',
      payload: { name: 'README.md', content: '# My Awesome GitJourney Project' },
    },
    isCompleted: (state: TutorialState) => state.fileSystem.files.some(f => f.name === 'README.md' && f.status === 'modified'),
  },
  {
    id: 6,
    title: "Creating a Directory",
    description: (
       <div className="space-y-4">
        <p>
          Now, let's create a directory to organize our code. Use the <Code>mkdir</Code> command to create a directory named <Code>src</Code>.
        </p>
        <div className="bg-muted p-2 rounded-md">
          <pre className="font-code text-sm">mkdir src</pre>
        </div>
      </div>
    ),
    commandToProceed: /^mkdir src$/,
    isCompleted: (state: TutorialState) => state.fileSystem.dirs.some(d => d.name === 'src'),
  },
  {
    id: 7,
    title: "Creating a File in a Directory",
    description: (
       <div className="space-y-4">
        <p>
          Great, you've created a <Code>src</Code> directory. Now let's create a new file inside it using the <Code>touch</Code> command again.
        </p>
        <div className="bg-muted p-2 rounded-md">
          <pre className="font-code text-sm">touch src/app.js</pre>
        </div>
      </div>
    ),
    commandToProceed: /^touch src\/app.js$/,
    isCompleted: (state: TutorialState) => state.fileSystem.dirs.some(d => d.name === 'src' && d.files.some(f => f.name === 'app.js')),
  },
  {
    id: 8,
    title: "Viewing Full Status",
    description: (
      <div className="space-y-4">
        <p>
          You now have a modified file (<Code>README.md</Code>) and a new untracked file (<Code>src/app.js</Code>).
        </p>
        <p>
          Run <Code>git status</Code> again to see how Git tracks all of these different changes.
        </p>
        <div className="bg-muted p-2 rounded-md">
          <pre className="font-code text-sm">git status</pre>
        </div>
      </div>
    ),
    commandToProceed: /^git status$/,
    isCompleted: (state: TutorialState) => {
        const lastCommand = state.terminalHistory.at(-2);
        return !!(lastCommand?.type === 'command' && lastCommand.content === 'git status' && state.currentStep === 8);
    },
  },
  {
    id: 9,
    title: "Staging All Changes",
    description: (
      <div className="space-y-4">
        <p>
          Instead of adding files one by one, you can stage all changes in the current directory and subdirectories by using a period (<Code>.</Code>) with <Code>git add</Code>. This is a very common shortcut.
        </p>
        <div className="bg-muted p-2 rounded-md">
          <pre className="font-code text-sm">git add .</pre>
        </div>
      </div>
    ),
    commandToProceed: /^git add \.$/,
    isCompleted: (state: TutorialState) => {
      const readme = state.fileSystem.files.find(f => f.name === 'README.md');
      const appJs = state.fileSystem.dirs.find(d => d.name === 'src')?.files.find(f => f.name === 'app.js');
      return readme?.status === 'staged' && appJs?.status === 'staged';
    },
  },
  {
    id: 10,
    title: "Committing Multiple Changes",
    description: (
      <div className="space-y-4">
        <p>
          Perfect, both files are staged. Now you can commit this set of changes. Write a commit message that summarizes the work you did.
        </p>
        <div className="bg-muted p-2 rounded-md">
          <pre className="font-code text-sm">git commit -m "Update README and add app structure"</pre>
        </div>
      </div>
    ),
    commandToProceed: /^git commit -m ".*"$/,
    isCompleted: (state: TutorialState) => state.commits.length > 1,
  },
  {
    id: 11,
    title: "Connecting to GitHub",
    description: (
      <div className="space-y-4">
        <p>
          You now have a solid history of your project locally. To collaborate or back up your code, you need to "push" it to a remote service like GitHub.
        </p>
        <p className="flex items-center gap-2">
          First, go to your account on <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-accent">GitHub.com</a> <Github className="inline h-4 w-4" /> and create a new, empty repository. Do not initialize it with a README, .gitignore, or license file.
        </p>
        <p>
          After creating the repository, GitHub will show you a URL for it. Copy the HTTPS URL (it should end with <Code>.git</Code>).
        </p>
        <p>
          We use the <Code>git remote add</Code> command to link our local repo to that URL. Let's add a remote named "origin" using the URL you just copied. Replace the placeholder URL in the command below.
        </p>
        <div className="bg-muted p-2 rounded-md">
          <pre className="font-code text-sm">git remote add origin &lt;your-github-repo-url&gt;</pre>
        </div>
      </div>
    ),
    commandToProceed: /^git remote add origin .*/,
    isCompleted: (state: TutorialState) => state.remoteUrl !== null,
  },
  {
    id: 12,
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
    id: 13,
    title: 'Congratulations!',
    description: (
      <div className="space-y-4">
        <p>You've completed the basic Git workflow! You have:</p>
        <ul className="list-disc list-inside space-y-2">
          <li>Initialized a local Git repository.</li>
          <li>Created directories and files using the terminal.</li>
          <li>Staged and committed your changes multiple times.</li>
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
