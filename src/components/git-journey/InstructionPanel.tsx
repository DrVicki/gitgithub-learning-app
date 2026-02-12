"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTutorial } from "./TutorialProvider";

export function InstructionPanel() {
  const { currentStepData } = useTutorial();

  return (
    <Card className="flex-1 flex flex-col h-full">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">
          {currentStepData.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="prose dark:prose-invert text-base flex-1 overflow-y-auto">
        {currentStepData.description}
      </CardContent>
    </Card>
  );
}
