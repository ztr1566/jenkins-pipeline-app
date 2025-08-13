import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  Search, 
  Play, 
  Pause, 
  RotateCcw, 
  Power, 
  Filter, 
  ChevronDown
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Service Status type
type ServiceStatus = "running" | "stopped" | "warning";

// Service interface
interface Service {
  id: string;
  name: string;
  description: string;
  status: ServiceStatus;
  uptime?: string;
  memory?: string;
  cpu?: string;
}

interface ServiceStatusProps extends React.HTMLAttributes<HTMLDivElement> {}

export function ServiceStatus({ className, ...props }: ServiceStatusProps) {
  // Mock services data
  const mockServices: Service[] = [
    {
      id: "1",
      name: "nginx",
      description: "High Performance Web Server",
      status: "running",
      uptime: "2d 5h 23m",
      memory: "128MB",
      cpu: "0.5%"
    },
    {
      id: "2",
      name: "mariadb",
      description: "MariaDB Database Server",
      status: "running",
      uptime: "2d 5h 21m",
      memory: "256MB",
      cpu: "1.2%"
    },
    {
      id: "3",
      name: "sshd",
      description: "OpenSSH Server",
      status: "running",
      uptime: "2d 5h 23m",
      memory: "12MB",
      cpu: "0.1%"
    },
    {
      id: "4",
      name: "apache2",
      description: "Apache HTTP Server",
      status: "stopped",
      uptime: "-",
      memory: "-",
      cpu: "-"
    },
    {
      id: "5",
      name: "fail2ban",
      description: "Ban IPs that show malicious signs",
      status: "running",
      uptime: "2d 5h 23m",
      memory: "18MB",
      cpu: "0.2%"
    },
    {
      id: "6",
      name: "ufw",
      description: "Uncomplicated Firewall",
      status: "warning",
      uptime: "2d 5h 23m",
      memory: "8MB",
      cpu: "0.1%"
    },
  ];
  
  const [services, setServices] = React.useState<Service[]>(mockServices);
  const [filter, setFilter] = React.useState<ServiceStatus | "all">("all");
  const [searchQuery, setSearchQuery] = React.useState("");
  
  // Filter services based on status and search query
  const filteredServices = React.useMemo(() => {
    return services
      .filter(service => 
        filter === "all" || service.status === filter
      )
      .filter(service => 
        service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
  }, [services, filter, searchQuery]);
  
  const handleServiceAction = (id: string, action: "start" | "stop" | "restart") => {
    setServices(prevServices => 
      prevServices.map(service => {
        if (service.id === id) {
          // Simulate service actions
          switch (action) {
            case "start":
              return {
                ...service,
                status: "running" as ServiceStatus,
                uptime: "0m",
                memory: service.memory || "32MB",
                cpu: service.cpu || "0.3%"
              };
            case "stop":
              return {
                ...service,
                status: "stopped" as ServiceStatus,
                uptime: "-",
                memory: "-",
                cpu: "-"
              };
            case "restart":
              return {
                ...service,
                status: "running" as ServiceStatus,
                uptime: "0m"
              };
          }
        }
        return service;
      })
    );
  };
  
  // Status indicator component
  const StatusIndicator = ({ status }: { status: ServiceStatus }) => {
    const statusClasses = {
      running: "bg-success animate-pulse",
      stopped: "bg-destructive",
      warning: "bg-warning animate-pulse-orange"
    };
    
    return (
      <div className="flex items-center gap-2">
        <div className={cn(
          "h-2.5 w-2.5 rounded-full",
          statusClasses[status]
        )} />
        <span className="capitalize">{status}</span>
      </div>
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
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">System Services</h3>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1">
                <Filter className="h-4 w-4" />
                {filter === "all" ? "All Services" : `${filter.charAt(0).toUpperCase() + filter.slice(1)}`}
                <ChevronDown className="h-3.5 w-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setFilter("all")}>
                All Services
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter("running")}>
                Running
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter("stopped")}>
                Stopped
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter("warning")}>
                Warning
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input 
            type="search"
            placeholder="Search services..."
            className="w-full rounded-md border border-input bg-background py-2 pl-9 pr-3 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50 text-left">
            <tr>
              <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold text-muted-foreground">Name</th>
              <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold text-muted-foreground">Description</th>
              <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold text-muted-foreground">Status</th>
              <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold text-muted-foreground">Uptime</th>
              <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold text-muted-foreground">Memory</th>
              <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold text-muted-foreground">CPU</th>
              <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredServices.length > 0 ? (
              filteredServices.map((service) => (
                <tr 
                  key={service.id} 
                  className="border-b border-muted hover:bg-muted/30"
                >
                  <td className="whitespace-nowrap px-4 py-3 font-medium text-foreground">
                    {service.name}
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    {service.description}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm">
                    <StatusIndicator status={service.status} />
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-muted-foreground">
                    {service.uptime}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-muted-foreground">
                    {service.memory}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-muted-foreground">
                    {service.cpu}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleServiceAction(service.id, "start")}
                        disabled={service.status === "running"}
                        title="Start"
                      >
                        <Play className="h-4 w-4 text-success" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleServiceAction(service.id, "stop")}
                        disabled={service.status === "stopped"}
                        title="Stop"
                      >
                        <Pause className="h-4 w-4 text-destructive" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleServiceAction(service.id, "restart")}
                        disabled={service.status === "stopped"}
                        title="Restart"
                      >
                        <RotateCcw className="h-4 w-4 text-warning" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-muted-foreground">
                  No services found matching your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}