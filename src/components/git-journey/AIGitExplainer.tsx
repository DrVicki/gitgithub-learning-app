"use client";

import { useState } from "react";
import { BrainCircuit, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { getGitExplanation } from "@/app/actions";
import { useTutorial } from "./TutorialProvider";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";

export function AIGitExplainer() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [explanation, setExplanation] = useState("");
  const { currentStepData } = useTutorial();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;

    setIsLoading(true);
    setExplanation("");

    const result = await getGitExplanation({
      query,
      context: currentStepData.title,
    });

    setIsLoading(false);
    if (result.success) {
      setExplanation(result.explanation!);
    } else {
      toast({
        variant: "destructive",
        title: "AI Error",
        description: result.error,
      });
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="secondary">
          <BrainCircuit className="mr-2 h-4 w-4" />
          AI Git Explainer
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>AI Git Explainer</SheetTitle>
          <SheetDescription>
            Have a question about Git? Ask GitBuddy! Your question will be sent
            with the context of your current step: "{currentStepData.title}".
          </SheetDescription>
        </SheetHeader>
        <div className="py-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Textarea
              placeholder="e.g., What's the difference between Git and GitHub?"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              rows={3}
              className="font-code"
            />
            <Button type="submit" disabled={isLoading || !query} className="w-full">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Ask GitBuddy
            </Button>
          </form>
        </div>
        {explanation && (
          <Alert>
            <BrainCircuit className="h-4 w-4" />
            <AlertTitle>GitBuddy's Explanation</AlertTitle>
            <AlertDescription className="prose dark:prose-invert prose-sm whitespace-pre-wrap">
              {explanation}
            </AlertDescription>
          </Alert>
        )}
      </SheetContent>
    </Sheet>
  );
}
