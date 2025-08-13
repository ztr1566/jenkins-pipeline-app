import { ResourceChart } from "@/components/console/ResourceChart";

export default function MonitoringPage() {
  return (
    <div className="flex-1 space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">System Monitoring</h1>
        <p className="text-muted-foreground">
          Real-time monitoring of system resources and performance
        </p>
      </div>

      {/* Large Resource Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <ResourceChart 
          title="CPU Usage" 
          type="cpu"
          height={300}
        />
        <ResourceChart 
          title="Memory Usage" 
          type="memory"
          height={300}
        />
        <ResourceChart 
          title="Disk I/O" 
          type="disk"
          height={300}
        />
        <ResourceChart 
          title="Network Activity" 
          type="network"
          height={300}
        />
      </div>
    </div>
  );
}