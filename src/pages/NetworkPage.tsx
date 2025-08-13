import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { 
  Wifi, 
  Cable,
  Globe,
  Router,
  Settings,
  CheckCircle,
  AlertTriangle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function NetworkPage() {
  const { toast } = useToast();
  const [dhcpEnabled, setDhcpEnabled] = React.useState(true);

  const networkInterfaces = [
    {
      name: "eth0",
      type: "ethernet",
      status: "connected",
      ip: "192.168.1.100",
      netmask: "255.255.255.0",
      gateway: "192.168.1.1",
      speed: "1000 Mbps"
    },
    {
      name: "wlan0",
      type: "wifi",
      status: "disconnected",
      ip: "-",
      netmask: "-",
      gateway: "-",
      speed: "-"
    }
  ];

  const handleSave = () => {
    toast({
      title: "Network Settings Saved",
      description: "Network configuration has been updated successfully.",
    });
  };

  return (
    <div className="flex-1 space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Network Settings</h1>
        <p className="text-muted-foreground">
          Configure network interfaces and connectivity
        </p>
      </div>

      {/* Network Interfaces */}
      <div className="grid gap-6 lg:grid-cols-2">
        {networkInterfaces.map((iface) => (
          <Card key={iface.name} className="p-6">
            <div className="flex items-center gap-3 mb-4">
              {iface.type === "ethernet" ? (
                <Cable className="h-6 w-6 text-primary" />
              ) : (
                <Wifi className="h-6 w-6 text-primary" />
              )}
              <div>
                <h3 className="font-semibold">{iface.name}</h3>
                <p className="text-sm text-muted-foreground capitalize">{iface.type}</p>
              </div>
              <div className="ml-auto">
                {iface.status === "connected" ? (
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    <span className="text-sm text-success">Connected</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-warning" />
                    <span className="text-sm text-warning">Disconnected</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>IP Address:</span>
                <span className="font-mono">{iface.ip}</span>
              </div>
              <div className="flex justify-between">
                <span>Netmask:</span>
                <span className="font-mono">{iface.netmask}</span>
              </div>
              <div className="flex justify-between">
                <span>Gateway:</span>
                <span className="font-mono">{iface.gateway}</span>
              </div>
              <div className="flex justify-between">
                <span>Speed:</span>
                <span>{iface.speed}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Network Configuration */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <Settings className="h-6 w-6 text-primary" />
          <h3 className="text-lg font-semibold">Network Configuration</h3>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="dhcp">Enable DHCP</Label>
              <Switch
                id="dhcp"
                checked={dhcpEnabled}
                onCheckedChange={setDhcpEnabled}
              />
            </div>

            {!dhcpEnabled && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="static-ip">Static IP Address</Label>
                  <Input 
                    id="static-ip" 
                    placeholder="192.168.1.100" 
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="netmask">Subnet Mask</Label>
                  <Input 
                    id="netmask" 
                    placeholder="255.255.255.0" 
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="gateway">Gateway</Label>
                  <Input 
                    id="gateway" 
                    placeholder="192.168.1.1" 
                    className="mt-1"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="dns1">Primary DNS</Label>
              <Input 
                id="dns1" 
                placeholder="8.8.8.8" 
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="dns2">Secondary DNS</Label>
              <Input 
                id="dns2" 
                placeholder="8.8.4.4" 
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="hostname">Hostname</Label>
              <Input 
                id="hostname" 
                placeholder="ubuntu-server" 
                className="mt-1"
              />
            </div>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <Button onClick={handleSave}>Save Configuration</Button>
          <Button variant="outline">Test Connection</Button>
        </div>
      </Card>
    </div>
  );
}