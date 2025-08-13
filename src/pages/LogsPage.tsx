import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  FileText, 
  Download, 
  Search, 
  Filter,
  AlertTriangle,
  Info,
  CheckCircle,
  XCircle,
  Calendar,
  Clock
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface LogEntry {
  id: number;
  timestamp: string;
  level: "error" | "warning" | "info" | "debug";
  service: string;
  message: string;
  source: string;
}

export default function LogsPage() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [logLevel, setLogLevel] = React.useState("all");
  const [selectedService, setSelectedService] = React.useState("all");

  const [logs] = React.useState<LogEntry[]>([
    {
      id: 1,
      timestamp: "2024-01-21 14:30:25",
      level: "info",
      service: "systemd",
      message: "Started Update UTMP about System Runlevel Changes.",
      source: "/var/log/syslog"
    },
    {
      id: 2,
      timestamp: "2024-01-21 14:29:18",
      level: "error",
      service: "nginx",
      message: "Failed to bind to port 80: Address already in use",
      source: "/var/log/nginx/error.log"
    },
    {
      id: 3,
      timestamp: "2024-01-21 14:28:45",
      level: "warning",
      service: "kernel",
      message: "Temperature above threshold on CPU core 2",
      source: "/var/log/kern.log"
    },
    {
      id: 4,
      timestamp: "2024-01-21 14:27:12",
      level: "info",
      service: "ssh",
      message: "Accepted publickey for admin from 192.168.1.50 port 52438 ssh2",
      source: "/var/log/auth.log"
    },
    {
      id: 5,
      timestamp: "2024-01-21 14:25:33",
      level: "error",
      service: "mariadb",
      message: "Table './mysql/db' is marked as crashed and should be repaired",
      source: "/var/log/mysql/error.log"
    },
    {
      id: 6,
      timestamp: "2024-01-21 14:24:07",
      level: "warning",
      service: "ufw",
      message: "Rate limiting enabled for source 192.168.1.100",
      source: "/var/log/ufw.log"
    },
    {
      id: 7,
      timestamp: "2024-01-21 14:22:55",
      level: "info",
      service: "cron",
      message: "CRON session opened for user root",
      source: "/var/log/cron.log"
    },
    {
      id: 8,
      timestamp: "2024-01-21 14:21:18",
      level: "debug",
      service: "systemd",
      message: "Started Session 15 of user ubuntu.",
      source: "/var/log/syslog"
    }
  ]);

  const services = ["all", ...Array.from(new Set(logs.map(log => log.service)))];

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         log.service.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLevel = logLevel === "all" || log.level === logLevel;
    const matchesService = selectedService === "all" || log.service === selectedService;
    
    return matchesSearch && matchesLevel && matchesService;
  });

  const getLevelIcon = (level: string) => {
    switch (level) {
      case "error": return <XCircle className="h-4 w-4 text-destructive" />;
      case "warning": return <AlertTriangle className="h-4 w-4 text-warning" />;
      case "info": return <Info className="h-4 w-4 text-primary" />;
      case "debug": return <CheckCircle className="h-4 w-4 text-muted-foreground" />;
      default: return <Info className="h-4 w-4" />;
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "error": return "text-destructive bg-destructive/10";
      case "warning": return "text-warning bg-warning/10";
      case "info": return "text-primary bg-primary/10";
      case "debug": return "text-muted-foreground bg-muted/50";
      default: return "text-muted-foreground";
    }
  };

  const exportLogs = () => {
    const logData = filteredLogs.map(log => 
      `${log.timestamp} [${log.level.toUpperCase()}] ${log.service}: ${log.message}`
    ).join('\n');
    
    const blob = new Blob([logData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `system-logs-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex-1 space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">System Logs</h1>
        <p className="text-muted-foreground">
          Monitor system events, errors, and service messages
        </p>
      </div>

      {/* Filters and Actions */}
      <Card className="p-6">
        <div className="grid gap-4 md:grid-cols-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input 
              type="search"
              placeholder="Search logs..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Select value={logLevel} onValueChange={setLogLevel}>
            <SelectTrigger>
              <SelectValue placeholder="Log Level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="error">Error</SelectItem>
              <SelectItem value="warning">Warning</SelectItem>
              <SelectItem value="info">Info</SelectItem>
              <SelectItem value="debug">Debug</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedService} onValueChange={setSelectedService}>
            <SelectTrigger>
              <SelectValue placeholder="Service" />
            </SelectTrigger>
            <SelectContent>
              {services.map(service => (
                <SelectItem key={service} value={service}>
                  {service === "all" ? "All Services" : service}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button onClick={exportLogs} className="gap-2">
            <Download className="h-4 w-4" />
            Export Logs
          </Button>
        </div>
      </Card>

      {/* Log Statistics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <XCircle className="h-5 w-5 text-destructive" />
            <div>
              <div className="text-2xl font-bold text-destructive">
                {logs.filter(log => log.level === "error").length}
              </div>
              <div className="text-sm text-muted-foreground">Errors</div>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-warning" />
            <div>
              <div className="text-2xl font-bold text-warning">
                {logs.filter(log => log.level === "warning").length}
              </div>
              <div className="text-sm text-muted-foreground">Warnings</div>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <Info className="h-5 w-5 text-primary" />
            <div>
              <div className="text-2xl font-bold text-primary">
                {logs.filter(log => log.level === "info").length}
              </div>
              <div className="text-sm text-muted-foreground">Info</div>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-foreground" />
            <div>
              <div className="text-2xl font-bold text-foreground">
                {filteredLogs.length}
              </div>
              <div className="text-sm text-muted-foreground">Total Shown</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Logs Table */}
      <Card className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Time</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Level</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Service</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Message</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Source</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="border-b border-muted hover:bg-muted/30">
                    <td className="px-4 py-3 font-mono text-sm text-muted-foreground">
                      {log.timestamp}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {getLevelIcon(log.level)}
                        <span className={`text-xs font-medium px-2 py-1 rounded ${getLevelColor(log.level)}`}>
                          {log.level.toUpperCase()}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-medium">
                      {log.service}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {log.message}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                      {log.source}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-muted-foreground">
                    No logs found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}