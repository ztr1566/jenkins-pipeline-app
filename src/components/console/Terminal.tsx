import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Terminal as TerminalIcon, X, Copy, CheckCheck } from "lucide-react";

interface TerminalProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultCommand?: string;
}

export function Terminal({ className, defaultCommand = "", ...props }: TerminalProps) {
  const [history, setHistory] = React.useState<string[]>([]);
  const [currentCommand, setCurrentCommand] = React.useState(defaultCommand);
  const [commandHistory, setCommandHistory] = React.useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = React.useState(-1);
  const [copied, setCopied] = React.useState(false);
  
  const terminalRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  
  const focusInput = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };
  
  React.useEffect(() => {
    focusInput();
  }, []);
  
  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentCommand.trim()) return;
    
    // Add command to history
    setHistory([...history, `$ ${currentCommand}`]);
    
    // Simulate response
    const response = simulateResponse(currentCommand);
    if (response) {
      setHistory([...history, `$ ${currentCommand}`, response]);
    } else {
      setHistory([...history, `$ ${currentCommand}`]);
    }
    
    // Update command history for up/down navigation
    setCommandHistory([...commandHistory, currentCommand]);
    setHistoryIndex(-1);
    setCurrentCommand("");
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (historyIndex < commandHistory.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setCurrentCommand(commandHistory[commandHistory.length - 1 - newIndex]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setCurrentCommand(commandHistory[commandHistory.length - 1 - newIndex]);
      } else {
        setHistoryIndex(-1);
        setCurrentCommand("");
      }
    }
  };
  
  const simulateResponse = (cmd: string): string => {
    const command = cmd.trim().toLowerCase();
    
    if (command === "help") {
      return `Available commands:
- help: Show this help message
- clear: Clear terminal
- ls: List files
- uname -a: Show system information
- uptime: Show uptime
- free -h: Show memory usage
- df -h: Show disk usage`;
    }
    
    if (command === "clear") {
      setTimeout(() => {
        setHistory([]);
      }, 0);
      return "";
    }
    
    if (command === "ls") {
      return "bin  boot  dev  etc  home  lib  lib64  media  mnt  opt  proc  root  run  sbin  srv  sys  tmp  usr  var";
    }
    
    if (command === "uname -a") {
      return "Linux ubuntu-web-console 5.15.0-52-generic #58-Ubuntu SMP Thu Oct 13 08:03:55 UTC 2022 x86_64 GNU/Linux";
    }
    
    if (command === "uptime") {
      return "14:23:20 up 2 days, 3:14, 1 user, load average: 0.52, 0.58, 0.59";
    }
    
    if (command === "free -h") {
      return `              total        used        free      shared  buff/cache   available
Mem:          7.8Gi       3.2Gi       1.0Gi       320Mi       3.5Gi       4.0Gi
Swap:         2.0Gi          0B       2.0Gi`;
    }
    
    if (command === "df -h") {
      return `Filesystem      Size  Used Avail Use% Mounted on
/dev/sda1       120G   28G   86G  25% /
tmpfs           1.6G     0  1.6G   0% /dev/shm
/dev/sda2       512M  7.8M  504M   2% /boot/efi`;
    }
    
    return `Command not found: ${command}`;
  };
  
  const copyToClipboard = () => {
    const terminalContent = history.join("\n");
    navigator.clipboard.writeText(terminalContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <div 
      className={cn(
        "flex h-full flex-col rounded-lg border border-muted bg-terminal shadow-lg", 
        className
      )}
      onClick={focusInput}
      {...props}
    >
      <div className="flex items-center justify-between border-b border-muted p-2">
        <div className="flex items-center gap-2">
          <TerminalIcon className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium text-terminal-foreground">
            Terminal
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-terminal-foreground hover:text-primary"
            onClick={copyToClipboard}
            title="Copy terminal content"
          >
            {copied ? (
              <CheckCheck className="h-3.5 w-3.5" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-terminal-foreground hover:text-destructive"
            onClick={() => setHistory([])}
            title="Clear terminal"
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
      
      <div 
        ref={terminalRef}
        className="flex-1 overflow-y-auto p-4 font-mono text-sm text-terminal-foreground"
      >
        {history.map((line, i) => (
          <div key={i} className="whitespace-pre-wrap">
            {line}
          </div>
        ))}
        <form onSubmit={handleCommand} className="mt-2 flex items-center">
          <span className="mr-2 text-primary">$</span>
          <input
            ref={inputRef}
            type="text"
            className="flex-1 bg-transparent outline-none"
            value={currentCommand}
            onChange={(e) => setCurrentCommand(e.target.value)}
            onKeyDown={handleKeyDown}
            spellCheck="false"
            autoComplete="off"
          />
        </form>
      </div>
    </div>
  );
}