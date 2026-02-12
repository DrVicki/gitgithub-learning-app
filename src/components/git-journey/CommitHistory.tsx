"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTutorial } from "./TutorialProvider";
import { GitCommit, GitBranch } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export function CommitHistory() {
  const { state } = useTutorial();

  return (
    <div className="relative h-full overflow-y-auto">
       {state.commits.length === 0 ? (
         <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <GitCommit className="h-10 w-10 mb-2"/>
            <p className="text-sm">No commits yet.</p>
            <p className="text-xs">Your commit history will appear here.</p>
         </div>
       ) : (
        <div className="pl-6">
        {state.commits.map((commit, index) => (
          <div key={commit.id} className="relative flex items-start pb-8">
            {index !== state.commits.length - 1 && (
              <div className="absolute left-[10px] top-[10px] h-full w-0.5 bg-border" />
            )}
            <div className="z-10 flex h-5 w-5 items-center justify-center rounded-full bg-primary ring-4 ring-background">
              <div className="h-2 w-2 rounded-full bg-primary-foreground" />
            </div>
            <div className="ml-4 -mt-1">
              <p className="font-code text-sm text-foreground">{commit.message}</p>
              <p className="text-xs text-muted-foreground">
                <span className="font-semibold">GitJourney</span> committed{' '}
                {formatDistanceToNow(commit.timestamp, { addSuffix: true })}
              </p>
              <p className="font-code text-xs text-muted-foreground mt-1">
                commit {commit.shortId}
              </p>
            </div>
            {index === 0 && (
                <div className="absolute top-0 right-0 flex items-center gap-1 text-xs font-code bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-2 py-0.5 rounded-full">
                    <GitBranch className="h-3 w-3" />
                    main
                </div>
            )}
          </div>
        ))}
      </div>
       )}
    </div>
  );
}
