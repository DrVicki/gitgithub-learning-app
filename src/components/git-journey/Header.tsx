"use client";

import { GitGraph, RotateCcw, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTutorial } from "./TutorialProvider";
import { Progress } from "@/components/ui/progress";
import { AIGitExplainer } from "./AIGitExplainer";
import { tutorials } from "@/lib/tutorials";
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import type { Directory } from "@/lib/types";

export function Header() {
  const { resetTutorial, state } = useTutorial();
  const activeTutorial = tutorials[state.tutorialId];
  const progress = (state.currentStep / (activeTutorial.steps.length - 1)) * 100;

  const addDirectoryToZip = (zipFolder: JSZip, directory: Directory) => {
    directory.files.forEach((file) => {
      zipFolder.file(file.name, file.content);
    });
  
    directory.dirs.forEach((subDir) => {
      const newFolder = zipFolder.folder(subDir.name);
      if (newFolder) {
        addDirectoryToZip(newFolder, subDir);
      }
    });
  };

  const handleDownload = async () => {
    const zip = new JSZip();
    
    const projectFolder = zip.folder(state.fileSystem.name);

    if (projectFolder) {
      addDirectoryToZip(projectFolder, state.fileSystem);
    }
    
    const content = await zip.generateAsync({ type: 'blob' });
    saveAs(content, `${state.fileSystem.name}.zip`);
  };

  return (
    <header className="flex items-center justify-between p-4 border-b bg-card">
      <div className="flex items-center gap-3">
        <GitGraph className="h-8 w-8 text-primary" />
        <div className="flex flex-col gap-1">
          <h1 className="text-xl font-headline font-bold text-foreground leading-tight">
            GitJourney by Dr. Vicki
          </h1>
          <p className="text-sm text-muted-foreground">{activeTutorial.name}</p>
        </div>
      </div>
      <div className="flex-1 max-w-sm flex items-center gap-4">
        <Progress value={progress} className="h-2" />
        <span className="text-sm font-medium text-muted-foreground w-20 text-right">
          Step {state.currentStep + 1}/{activeTutorial.steps.length}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={handleDownload}>
          <Download className="mr-2 h-4 w-4" />
          Download Code
        </Button>
        <Button variant="outline" size="sm" onClick={resetTutorial}>
          <RotateCcw className="mr-2 h-4 w-4" />
          Reset Progress
        </Button>
        <AIGitExplainer />
      </div>
    </header>
  );
}
