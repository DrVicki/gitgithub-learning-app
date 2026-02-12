"use client";

import { useTutorial } from "./TutorialProvider";
import { File as FileIcon, Folder, GitGraph } from "lucide-react";
import { cn } from "@/lib/utils";
import type { File } from "@/lib/types";
import { Button } from "@/components/ui/button";

const FileStatusBadge = ({ status }: { status: File["status"] }) => {
  const statusMap = {
    untracked: {
      char: "U",
      className: "bg-gray-500 text-white",
      tooltip: "Untracked",
    },
    modified: {
      char: "M",
      className: "bg-yellow-500 text-black",
      tooltip: "Modified",
    },
    staged: {
      char: "S",
      className: "bg-green-500 text-white",
      tooltip: "Staged",
    },
    unmodified: {
      char: "",
      className: "",
      tooltip: "",
    },
  };

  const { char, className } = statusMap[status];
  if (!char) return null;

  return (
    <div
      className={cn(
        "absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full text-xs font-bold",
        className
      )}
    >
      {char}
    </div>
  );
};

const FileItem = ({ file }: { file: File }) => {
  const statusColorMap = {
    untracked: "text-gray-500 dark:text-gray-400",
    modified: "text-yellow-500 dark:text-yellow-400",
    staged: "text-green-500 dark:text-green-400",
    unmodified: "text-foreground",
  };

  return (
    <div
      className={cn(
        "flex items-center gap-2 p-1.5 rounded",
        statusColorMap[file.status]
      )}
    >
      <div className="relative">
        <FileIcon className="h-5 w-5" />
        <FileStatusBadge status={file.status} />
      </div>
      <span className="font-code text-sm">{file.name}</span>
    </div>
  );
};

export function FileSystemVisualizer() {
  const { state, dispatch, currentStepData } = useTutorial();
  const { fileSystem, repoInitialized } = state;

  const handleUiAction = () => {
    if (currentStepData.uiAction) {
      dispatch({
        type: currentStepData.uiAction.actionType,
        payload: currentStepData.uiAction.payload,
      });
    }
  };

  return (
    <div className="bg-muted/50 p-4 rounded-lg h-full overflow-y-auto">
      <div className="flex items-center gap-2 mb-4 text-sm font-semibold text-muted-foreground">
        <Folder className="h-5 w-5" />
        <span>gitjourney-project</span>
        {repoInitialized && (
          <GitGraph className="h-5 w-5 text-primary" title="Git Repository" />
        )}
      </div>

      <div className="pl-4 space-y-1">
        {fileSystem.files.map((file) => (
          <FileItem key={file.id} file={file} />
        ))}
        {fileSystem.files.length === 0 && (
           <p className="text-sm text-muted-foreground italic">No files yet.</p>
        )}
      </div>
      
      {currentStepData.uiAction && (
        <div className="mt-4">
          <Button onClick={handleUiAction} size="sm" className="w-full">
            {currentStepData.uiAction.label}
          </Button>
        </div>
      )}
    </div>
  );
}
