import { ServiceStatus } from "@/components/console/ServiceStatus";

export default function ServicesPage() {
  return (
    <div className="flex-1 space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">System Services</h1>
        <p className="text-muted-foreground">
          Manage and monitor system services and processes
        </p>
      </div>

      <ServiceStatus />
    </div>
  );
}