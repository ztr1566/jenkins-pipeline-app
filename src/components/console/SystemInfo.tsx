import * as React from "react";
import { cn } from "@/lib/utils";
import {
  Server,
  Clock,
  User,
  HardDrive,
  Cpu,
  Activity,
  MemoryStick
} from "lucide-react";

interface SystemInfoProps extends React.HTMLAttributes<HTMLDivElement> {}

export function SystemInfo({ className, ...props }: SystemInfoProps) {
  const [uptime, setUptime] = React.useState("2d 3h 14m");
  const [currentTime, setCurrentTime] = React.useState(new Date());
  
  // Update current time every second
  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Simulate increasing uptime
  React.useEffect(() => {
    const interval = setInterval(() => {
      // Parse current uptime
      const parts = uptime.split(' ');
      let days = parseInt(parts[0]);
      let hours = parseInt(parts[1]);
      let minutes = parseInt(parts[2]);
      
      // Increment minutes
      minutes++;
      
      // Handle minute rollover
      if (minutes >= 60) {
        minutes = 0;
        hours++;
      }
      
      // Handle hour rollover
      if (hours >= 24) {
        hours = 0;
        days++;
      }
      
      // Format the new uptime
      setUptime(`${days}d ${hours}h ${minutes}m`);
    }, 60000); // Update every minute
    
    return () => clearInterval(interval);
  }, [uptime]);
  
  // Format current time
  const formattedTime = currentTime.toLocaleTimeString();
  const formattedDate = currentTime.toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  // Mock system information
  const systemInfo = {
    hostname: "ubuntu-web-console",
    distribution: "Ubuntu 22.04.2 LTS (Jammy Jellyfish)",
    kernel: "5.15.0-52-generic",
    architecture: "x86_64",
    cpu: "Intel Core i7-9700K @ 3.60GHz (8 cores)",
    memory: "16GB DDR4",
    disk: "500GB SSD",
    user: "admin",
    load: "0.52, 0.58, 0.59"
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
        <h3 className="text-lg font-semibold text-foreground">System Information</h3>
      </div>
      
      <div className="grid gap-4 p-4 md:grid-cols-2">
        <div className="flex items-start gap-3">
          <Server className="h-5 w-5 text-primary mt-0.5" />
          <div>
            <div className="text-sm font-medium">Hostname</div>
            <div className="text-sm text-muted-foreground">{systemInfo.hostname}</div>
          </div>
        </div>
        
        <div className="flex items-start gap-3">
          <Clock className="h-5 w-5 text-primary mt-0.5" />
          <div>
            <div className="text-sm font-medium">Time & Date</div>
            <div className="text-sm text-muted-foreground">{formattedTime}</div>
            <div className="text-xs text-muted-foreground">{formattedDate}</div>
          </div>
        </div>
        
        <div className="flex items-start gap-3">
          <Activity className="h-5 w-5 text-primary mt-0.5" />
          <div>
            <div className="text-sm font-medium">System Uptime</div>
            <div className="text-sm text-muted-foreground">{uptime}</div>
          </div>
        </div>
        
        <div className="flex items-start gap-3">
          <User className="h-5 w-5 text-primary mt-0.5" />
          <div>
            <div className="text-sm font-medium">Current User</div>
            <div className="text-sm text-muted-foreground">{systemInfo.user}</div>
          </div>
        </div>
        
        <div className="flex items-start gap-3">
          <Cpu className="h-5 w-5 text-primary mt-0.5" />
          <div>
            <div className="text-sm font-medium">CPU</div>
            <div className="text-sm text-muted-foreground">{systemInfo.cpu}</div>
          </div>
        </div>
        
        <div className="flex items-start gap-3">
          <Activity className="h-5 w-5 text-primary mt-0.5" />
          <div>
            <div className="text-sm font-medium">Load Average</div>
            <div className="text-sm text-muted-foreground">{systemInfo.load}</div>
          </div>
        </div>
        
        <div className="flex items-start gap-3">
          <MemoryStick className="h-5 w-5 text-primary mt-0.5" />
          <div>
            <div className="text-sm font-medium">Memory</div>
            <div className="text-sm text-muted-foreground">{systemInfo.memory}</div>
          </div>
        </div>
        
        <div className="flex items-start gap-3">
          <HardDrive className="h-5 w-5 text-primary mt-0.5" />
          <div>
            <div className="text-sm font-medium">Storage</div>
            <div className="text-sm text-muted-foreground">{systemInfo.disk}</div>
          </div>
        </div>
      </div>
      
      <div className="border-t border-muted bg-muted/30 p-4">
        <div className="flex items-start gap-3">
          <div>
            <div className="text-sm font-medium">Distribution</div>
            <div className="text-sm text-muted-foreground">{systemInfo.distribution}</div>
            <div className="mt-1 text-xs text-muted-foreground">Kernel: {systemInfo.kernel}</div>
            <div className="text-xs text-muted-foreground">Architecture: {systemInfo.architecture}</div>
          </div>
        </div>
      </div>
    </div>
  );
}