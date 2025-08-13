import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  RotateCcw, 
  Power, 
  RefreshCw, 
  Download, 
  Shield, 
  AlertTriangle 
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

interface QuickActionsProps extends React.HTMLAttributes<HTMLDivElement> {}

export function QuickActions({ className, ...props }: QuickActionsProps) {
  const { toast } = useToast();
  
  const handleAction = (action: string, description: string) => {
    toast({
      title: `${action} Initiated`,
      description: description,
      duration: 3000,
    });
  };
  
  const actions = [
    {
      id: "reboot",
      label: "Reboot System",
      description: "Restart the Ubuntu system",
      icon: RotateCcw,
      variant: "destructive" as const,
      requiresConfirmation: true,
      message: "This will restart the entire system. All unsaved work will be lost.",
      action: () => handleAction("Reboot", "System will restart in 60 seconds")
    },
    {
      id: "shutdown",
      label: "Shutdown",
      description: "Safely shutdown the system",
      icon: Power,
      variant: "destructive" as const,
      requiresConfirmation: true,
      message: "This will shutdown the system. All services will be stopped.",
      action: () => handleAction("Shutdown", "System shutdown initiated")
    },
    {
      id: "refresh",
      label: "Refresh Services",
      description: "Reload systemd daemon configuration",
      icon: RefreshCw,
      variant: "action" as const,
      requiresConfirmation: false,
      action: () => handleAction("Refresh", "Systemd daemon configuration reloaded")
    },
    {
      id: "update",
      label: "Update Packages",
      description: "Check and install package updates",
      icon: Download,
      variant: "action" as const,
      requiresConfirmation: false,
      action: () => handleAction("Update", "Package update process started")
    },
    {
      id: "firewall",
      label: "Toggle Firewall",
      description: "Enable or disable UFW firewall",
      icon: Shield,
      variant: "system" as const,
      requiresConfirmation: true,
      message: "This will toggle the UFW firewall. Network connectivity may be affected.",
      action: () => handleAction("Firewall", "UFW firewall status toggled")
    },
    {
      id: "logs",
      label: "View Error Logs",
      description: "Open system error logs viewer",
      icon: AlertTriangle,
      variant: "ghost" as const,
      requiresConfirmation: false,
      action: () => handleAction("Logs", "Opening system error logs")
    }
  ];
  
  const ActionButton = ({ action }: { action: typeof actions[0] }) => {
    const Icon = action.icon;
    
    if (action.requiresConfirmation) {
      return (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant={action.variant}
              className="h-auto flex-col gap-2 p-4 text-center"
            >
              <Icon className="h-6 w-6" />
              <div>
                <div className="font-semibold">{action.label}</div>
                <div className="text-xs opacity-75">{action.description}</div>
              </div>
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <Icon className="h-5 w-5" />
                Confirm {action.label}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {action.message}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={action.action}
                className={action.variant === "destructive" ? "bg-destructive hover:bg-destructive/90" : ""}
              >
                Confirm
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      );
    }
    
    return (
      <Button
        variant={action.variant}
        className="h-auto flex-col gap-2 p-4 text-center"
        onClick={action.action}
      >
        <Icon className="h-6 w-6" />
        <div>
          <div className="font-semibold">{action.label}</div>
          <div className="text-xs opacity-75">{action.description}</div>
        </div>
      </Button>
    );
  };
  
  return (
    <div
      className={cn(
        "flex flex-col rounded-lg border border-muted bg-card shadow-md",
        className
      )}
      {...props}
    >
      <div className="border-b border-muted p-4">
        <h3 className="text-lg font-semibold text-foreground">Quick Actions</h3>
        <p className="text-sm text-muted-foreground">
          Common system administration tasks
        </p>
      </div>
      
      <div className="grid grid-cols-2 gap-4 p-4 lg:grid-cols-3">
        {actions.map((action) => (
          <ActionButton key={action.id} action={action} />
        ))}
      </div>
    </div>
  );
}