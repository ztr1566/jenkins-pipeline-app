import { ResourceChart } from "@/components/console/ResourceChart";
import { SystemInfo } from "@/components/console/SystemInfo";
import { QuickActions } from "@/components/console/QuickActions";
import { ServiceStatus } from "@/components/console/ServiceStatus";

export default function Dashboard() {
  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Ubuntu Console</h1>
          <p className="text-muted-foreground">
            Monitor and manage your Ubuntu system remotely
          </p>
        </div>
      </div>

      {/* Resource Charts Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <ResourceChart 
          title="CPU Usage" 
          type="cpu"
          height={150}
        />
        <ResourceChart 
          title="Memory" 
          type="memory"
          height={150}
        />
        <ResourceChart 
          title="Disk I/O" 
          type="disk"
          height={150}
        />
        <ResourceChart 
          title="Network" 
          type="network"
          height={150}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* System Info - Takes 1 column */}
        <div className="lg:col-span-1">
          <SystemInfo />
        </div>
        
        {/* Quick Actions - Takes 2 columns */}
        <div className="lg:col-span-2">
          <QuickActions />
        </div>
      </div>

      {/* Services Table - Full width */}
      <div>
        <ServiceStatus />
      </div>
    </div>
  );
}