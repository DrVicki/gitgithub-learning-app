import type { TutorialStep, TutorialState } from './types';
import { Github } from 'lucide-react';

const Code = ({ children }: { children: React.ReactNode }) => (
  <code className="bg-muted text-foreground font-code px-1 py-0.5 rounded text-sm">
    {children}
  </code>
);

export const portfolioTutorialSteps: TutorialStep[] = [
  {
    id: 0,
    title: "Build a Portfolio with GitHub Pages",
    description: (
      <div className="space-y-4">
        <p>
          Welcome! In this tutorial, you'll create a simple personal portfolio website and deploy it for free using GitHub Pages.
        </p>
        <p>
          We'll create an HTML file, turn the project into a Git repository, and push it to GitHub.
        </p>
        <p>
          First, let's create the main file for our website, <Code>index.html</Code>. Click the button in the File System panel.
        </p>
      </div>
    ),
    uiAction: {
        label: 'Create index.html',
        actionType: 'CREATE_FILE',
        payload: { name: 'index.html', content: '' },
    },
    isCompleted: (state: TutorialState) => state.fileSystem.files.some(f => f.name === 'index.html'),
  },
  {
    id: 1,
    title: "Add Content to Your Portfolio",
    description: (
        <div className="space-y-4">
            <p>
                Great, you've created <Code>index.html</Code>. Now, let's add some basic HTML content to it. This will be a very simple portfolio.
            </p>
            <p>
                Click the button below to add a title and a heading to your file. In a real project, you would edit this file yourself.
            </p>
        </div>
    ),
    uiAction: {
        label: 'Add HTML Content',
        actionType: 'MODIFY_FILE',
        payload: { name: 'index.html', content: '<!DOCTYPE html>\n<html>\n<head>\n  <title>My Portfolio</title>\n</head>\n<body>\n  <h1>Welcome to My Portfolio!</h1>\n</body>\n</html>' },
    },
    isCompleted: (state: TutorialState) => (state.fileSystem.files.find(f => f.name === 'index.html')?.content.includes('<h1>') ?? false) && state.fileSystem.files.find(f => f.name === 'index.html')?.status === 'modified',
  },
  {
    id: 2,
    title: "Initialize a Git Repository",
    description: (
      <div className="space-y-4">
        <p>
          Now that we have our first file, let's start tracking our project with Git. To do this, we need to initialize a Git repository.
        </p>
        <p>
          Type the following command in the terminal to begin:
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
    id: 3,
    title: "Stage Your File",
    description: (
      <div className="space-y-4">
        <p>
          The repository is initialized! Notice the file <Code>index.html</Code> is marked as "untracked". We need to tell Git to start tracking it.
        </p>
        <p>
          Use the <Code>git add</Code> command to stage the file for the first commit.
        </p>
        <div className="bg-muted p-2 rounded-md">
          <pre className="font-code text-sm">git add index.html</pre>
        </div>
      </div>
    ),
    commandToProceed: /^git add (index.html|\.)$/,
    isCompleted: (state: TutorialState) => state.fileSystem.files.some(f => f.name === 'index.html' && f.status === 'staged'),
  },
  {
    id: 4,
    title: "Make Your First Commit",
    description: (
      <div className="space-y-4">
        <p>
          The file is staged and ready. Now, let's commit it to our repository's history with a descriptive message.
        </p>
        <div className="bg-muted p-2 rounded-md">
          <pre className="font-code text-sm">git commit -m "Create initial index.html"</pre>
        </div>
      </div>
    ),
    commandToProceed: /^git commit -m ".*"$/,
    isCompleted: (state: TutorialState) => state.commits.length > 0,
  },
  {
    id: 5,
    title: "Create a GitHub Repository",
    description: (
      <div className="space-y-4">
        <p>
          Your code is committed locally. To publish it, you need a remote repository on GitHub.
        </p>
        <p className="flex items-center gap-2">
          Normally, you would now go to GitHub.com <Github className="inline h-4 w-4" />, create a new, empty public repository (without a README), and name it something like "my-portfolio".
        </p>
        <p>
          GitHub will provide a URL. We'll use a demo URL for this tutorial. Link your local repo to the remote one with this command:
        </p>
        <div className="bg-muted p-2 rounded-md">
          <pre className="font-code text-sm">git remote add origin https://github.com/git-journey/portfolio-demo.git</pre>
        </div>
      </div>
    ),
    commandToProceed: /^git remote add origin .*/,
    isCompleted: (state: TutorialState) => state.remoteUrl !== null,
  },
  {
    id: 6,
    title: "Push Your Code to GitHub",
    description: (
      <div className="space-y-4">
        <p>
          The remote is set up. Now, "push" your local `main` branch and all its commits to the `origin` remote on GitHub.
        </p>
        <p>
          The <Code>-u</Code> flag links the local and remote branches, so you can just use <Code>git push</Code> in the future.
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
    id: 7,
    title: "Enable GitHub Pages",
    description: (
      <div className="space-y-4">
        <p>
          Your code is on GitHub! The final step is to enable GitHub Pages.
        </p>
        <p>
          In your real repository on GitHub.com, you would go to <Code>Settings &gt; Pages</Code>. Under "Branch", select <Code>main</Code> and click "Save".
        </p>
        <p>
          After a minute or two, your website will be live at a URL like <Code>https://your-username.github.io/my-portfolio/</Code>.
        </p>
        <p>
          Congratulations! You've built and deployed a website using Git and GitHub Pages.
        </p>
      </div>
    ),
    isCompleted: (state: TutorialState) => false,
  }
];
