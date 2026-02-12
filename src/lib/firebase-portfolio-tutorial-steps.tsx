import type { TutorialStep, TutorialState } from './types';

const Code = ({ children }: { children: React.ReactNode }) => (
  <code className="bg-muted text-foreground font-code px-1 py-0.5 rounded text-sm">
    {children}
  </code>
);

const FirebaseIcon = () => (
    <svg width="1em" height="1em" viewBox="0 0 16 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="inline h-4 w-4">
        <path d="M3.203 22.001l8.59-19.422a.54.54 0 0 1 1.007.468v10.028a.54.54 0 0 0 .8.467l3.013-2.583a.54.54 0 0 1 .834.47v10.258a.54.54 0 0 1-.884.434l-3.72-3.05a.54.54 0 0 0-.75.008l-8.32 8.902a.54.54 0 0 1-.92-.464l.32-14.546V2.441a.54.54 0 0 1 1.007-.468L3.203 22z" fill="#FFCA28"></path>
        <path d="M7.749 7.37L3.52 17.07l9.453-7.407a.54.54 0 0 0-.21-1.002L7.749 7.37z" fill="#FFA000"></path>
    </svg>
);


export const firebasePortfolioTutorialSteps: TutorialStep[] = [
  {
    id: 0,
    title: "Build a Portfolio with Firebase Hosting",
    description: (
      <div className="space-y-4">
        <p>
          Welcome! In this tutorial, you'll create a simple personal portfolio and learn how to deploy it for free using Firebase Hosting.
        </p>
        <p>
          We'll create an HTML file, track it with Git, and then I'll guide you on using the Firebase CLI to get it online.
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
                Great, you've created <Code>index.html</Code>. Now, let's add some basic HTML content to it.
            </p>
            <p>
                Click the button below to add a title and a heading to your file.
            </p>
        </div>
    ),
    uiAction: {
        label: 'Add HTML Content',
        actionType: 'MODIFY_FILE',
        payload: { name: 'index.html', content: '<!DOCTYPE html>\n<html>\n<head>\n  <title>My Firebase Portfolio</title>\n</head>\n<body>\n  <h1>Welcome to My Firebase Portfolio!</h1>\n</body>\n</html>' },
    },
    isCompleted: (state: TutorialState) => (state.fileSystem.files.find(f => f.name === 'index.html')?.content.includes('<h1>') ?? false) && state.fileSystem.files.find(f => f.name === 'index.html')?.status === 'modified',
  },
  {
    id: 2,
    title: "Initialize a Git Repository",
    description: (
      <div className="space-y-4">
        <p>
          With our first file ready, let's start tracking our project with Git. Even though we are using Firebase, Git is essential for version control.
        </p>
        <p>
          Type the following command in the terminal to initialize a Git repository:
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
          <pre className="font-code text-sm">git commit -m "Initial portfolio commit"</pre>
        </div>
      </div>
    ),
    commandToProceed: /^git commit -m ".*"$/,
    isCompleted: (state: TutorialState) => state.commits.length > 0,
  },
  {
    id: 5,
    title: "The Firebase Hosting Workflow",
    description: (
      <div className="space-y-4">
        <p>
          Excellent! Your code is committed locally. The rest of the process happens outside this simulator in your computer's real terminal.
        </p>
        
        <ol className="list-decimal list-inside space-y-3">
          <li>
            <strong>Install the Firebase CLI:</strong> If you don't have it, you'll need Node.js, then run:
            <div className="bg-muted p-2 rounded-md mt-1"><pre className="font-code text-sm">npm install -g firebase-tools</pre></div>
          </li>
          <li>
            <strong>Login to Firebase:</strong>
            <div className="bg-muted p-2 rounded-md mt-1"><pre className="font-code text-sm">firebase login</pre></div>
          </li>
          <li>
            <strong>Initialize Firebase Hosting:</strong> In your project folder, run <Code>firebase init</Code>. Choose "Hosting", select your Firebase project, use the root directory (".") as your public directory, and answer "No" to configuring as a single-page app. This will create <Code>firebase.json</Code> and <Code>.firebaserc</Code> files.
          </li>
           <li>
            <strong>Deploy your site:</strong> This is the magic step!
            <div className="bg-muted p-2 rounded-md mt-1"><pre className="font-code text-sm">firebase deploy</pre></div>
            Firebase will give you a live URL.
          </li>
        </ol>
        <p>
          To make updates, you just change your files, <Code>git commit</Code> your changes, and run <Code>firebase deploy</Code> again. Type <Code>continue</Code> to finish.
        </p>
      </div>
    ),
    commandToProceed: /^continue$/,
    isCompleted: (state: TutorialState) => state.terminalHistory.some(l => l.type === 'command' && l.content === 'continue' && state.currentStep === 5),
  },
  {
    id: 6,
    title: "Congratulations!",
    description: (
      <div className="space-y-4">
        <p className="font-bold flex items-center gap-2">
          You've now learned the entire workflow for building a site locally with Git and deploying it globally with Firebase Hosting! <FirebaseIcon />
        </p>
        <p>
          You can apply this process to any static website project. Feel free to reset the tutorial or try another one.
        </p>
      </div>
    ),
    isCompleted: (state: TutorialState) => false,
  },
];
