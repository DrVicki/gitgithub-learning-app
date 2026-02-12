import { Header } from "@/components/git-journey/Header";
import { InstructionPanel } from "@/components/git-journey/InstructionPanel";
import { InteractivePanel } from "@/components/git-journey/InteractivePanel";
import { TutorialProvider } from "@/components/git-journey/TutorialProvider";

export default function Home() {
  return (
    <TutorialProvider>
      <div className="flex flex-col h-screen">
        <Header />
        <main className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 p-4 overflow-hidden">
          <div className="flex flex-col h-full overflow-hidden">
            <InstructionPanel />
          </div>
          <div className="flex flex-col h-full overflow-hidden">
            <InteractivePanel />
          </div>
        </main>
      </div>
    </TutorialProvider>
  );
}
