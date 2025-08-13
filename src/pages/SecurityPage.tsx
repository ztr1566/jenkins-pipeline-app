import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { 
  Shield, 
  Lock, 
  Unlock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Plus,
  Trash2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function SecurityPage() {
  const { toast } = useToast();
  const [firewallEnabled, setFirewallEnabled] = React.useState(true);
  const [sshEnabled, setSshEnabled] = React.useState(true);
  const [fail2banEnabled, setFail2banEnabled] = React.useState(true);

  const firewallRules = [
    { id: 1, port: "22", protocol: "TCP", source: "anywhere", action: "ALLOW", description: "SSH" },
    { id: 2, port: "80", protocol: "TCP", source: "anywhere", action: "ALLOW", description: "HTTP" },
    { id: 3, port: "443", protocol: "TCP", source: "anywhere", action: "ALLOW", description: "HTTPS" },
    { id: 4, port: "3000", protocol: "TCP", source: "192.168.1.0/24", action: "ALLOW", description: "Development" },
  ];

  const handleToggle = (service: string, enabled: boolean) => {
    toast({
      title: `${service} ${enabled ? 'Enabled' : 'Disabled'}`,
      description: `${service} has been ${enabled ? 'enabled' : 'disabled'} successfully.`,
    });
  };

  return (
    <div className="flex-1 space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Security Settings</h1>
        <p className="text-muted-foreground">
          Manage firewall, SSH access, and security policies
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Firewall Status */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Shield className="h-6 w-6 text-primary" />
              <div>
                <h3 className="text-lg font-semibold">UFW Firewall</h3>
                <p className="text-sm text-muted-foreground">Uncomplicated Firewall</p>
              </div>
            </div>
            <Switch
              checked={firewallEnabled}
              onCheckedChange={(checked) => {
                setFirewallEnabled(checked);
                handleToggle('Firewall', checked);
              }}
            />
          </div>
          <div className="flex items-center gap-2">
            {firewallEnabled ? (
              <>
                <CheckCircle className="h-4 w-4 text-success" />
                <span className="text-sm text-success">Active</span>
              </>
            ) : (
              <>
                <XCircle className="h-4 w-4 text-destructive" />
                <span className="text-sm text-destructive">Inactive</span>
              </>
            )}
          </div>
        </Card>

        {/* SSH Access */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              {sshEnabled ? (
                <Unlock className="h-6 w-6 text-primary" />
              ) : (
                <Lock className="h-6 w-6 text-destructive" />
              )}
              <div>
                <h3 className="text-lg font-semibold">SSH Access</h3>
                <p className="text-sm text-muted-foreground">Remote shell access</p>
              </div>
            </div>
            <Switch
              checked={sshEnabled}
              onCheckedChange={(checked) => {
                setSshEnabled(checked);
                handleToggle('SSH', checked);
              }}
            />
          </div>
          <div className="flex items-center gap-2">
            {sshEnabled ? (
              <>
                <CheckCircle className="h-4 w-4 text-success" />
                <span className="text-sm text-success">Port 22 Open</span>
              </>
            ) : (
              <>
                <XCircle className="h-4 w-4 text-destructive" />
                <span className="text-sm text-destructive">Disabled</span>
              </>
            )}
          </div>
        </Card>
      </div>

      {/* Firewall Rules */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Firewall Rules</h3>
          <Button size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            Add Rule
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Port</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Protocol</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Source</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Action</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Description</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {firewallRules.map((rule) => (
                <tr key={rule.id} className="border-b border-muted">
                  <td className="px-4 py-3 font-medium">{rule.port}</td>
                  <td className="px-4 py-3">{rule.protocol}</td>
                  <td className="px-4 py-3">{rule.source}</td>
                  <td className="px-4 py-3">
                    <span className={cn(
                      "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                      rule.action === "ALLOW" 
                        ? "bg-success/20 text-success" 
                        : "bg-destructive/20 text-destructive"
                    )}>
                      {rule.action}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{rule.description}</td>
                  <td className="px-4 py-3">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}