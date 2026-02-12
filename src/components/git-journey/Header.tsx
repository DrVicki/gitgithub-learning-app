"use client";

import { GitGraph, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTutorial } from "./TutorialProvider";
import { Progress } from "@/components/ui/progress";
import { AIGitExplainer } from "./AIGitExplainer";
import { tutorialSteps } from "@/lib/tutorial-steps";

export function Header() {
  const { resetTutorial, state } = useTutorial();
  const progress = (state.currentStep / (tutorialSteps.length - 1)) * 100;

  return (
    <header className="flex items-center justify-between p-4 border-b bg-card">
      <div className="flex items-center gap-3">
        <GitGraph className="h-8 w-8 text-primary" />
        <h1 className="text-2xl font-headline font-bold text-foreground">
          GitJourney
        </h1>
      </div>
      <div className="flex-1 max-w-sm flex items-center gap-4">
        <Progress value={progress} className="h-2" />
        <span className="text-sm font-medium text-muted-foreground w-20 text-right">
          Step {state.currentStep + 1}/{tutorialSteps.length}
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
