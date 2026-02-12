"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileSystemVisualizer } from "./FileSystemVisualizer";
import { CommitHistory } from "./CommitHistory";
import { CommandPrompt } from "./CommandPrompt";
import { GitCommit, Files } from "lucide-react";

export function InteractivePanel() {
  return (
    <div className="flex flex-col h-full gap-4">
      <Card className="flex-1 flex flex-col">
        <CardContent className="p-4 flex-1">
          <Tabs defaultValue="files" className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="files"><Files className="mr-2 h-4 w-4" />File System</TabsTrigger>
              <TabsTrigger value="commits"><GitCommit className="mr-2 h-4 w-4" />Commit History</TabsTrigger>
            </TabsList>
            <TabsContent value="files" className="flex-1 overflow-auto pt-2">
              <FileSystemVisualizer />
            </TabsContent>
            <TabsContent value="commits" className="flex-1 overflow-auto pt-2">
              <CommitHistory />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      <div className="h-[40%] flex flex-col">
        <CommandPrompt />
      </div>
    </div>
  );
}
