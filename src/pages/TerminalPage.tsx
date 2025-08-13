import { Terminal } from "@/components/console/Terminal";

export default function TerminalPage() {
  return (
    <div className="flex h-full flex-col p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">Terminal</h1>
        <p className="text-muted-foreground">
          Execute commands remotely on your Ubuntu system
        </p>
      </div>
      
      <div className="flex-1">
        <Terminal className="h-full" defaultCommand="help" />
      </div>
    </div>
  );
}