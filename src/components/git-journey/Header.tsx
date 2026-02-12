"use client";

import { GitGraph, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTutorial } from "./TutorialProvider";
import { Progress } from "@/components/ui/progress";
import { AIGitExplainer } from "./AIGitExplainer";
import { tutorials } from "@/lib/tutorials";

export function Header() {
  const { resetTutorial, state } = useTutorial();
  const activeTutorial = tutorials[state.tutorialId];
  const progress = (state.currentStep / (activeTutorial.steps.length - 1)) * 100;

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
        <Button variant="outline" size="sm" onClick={resetTutorial}>
          <RotateCcw className="mr-2 h-4 w-4" />
          Reset Progress
        </Button>
        <AIGitExplainer />
      </div>
    </header>
  );
}
