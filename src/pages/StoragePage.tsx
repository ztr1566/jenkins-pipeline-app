import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  HardDrive, 
  Folder,
  File,
  Trash2,
  Plus,
  Download
} from "lucide-react";

export default function StoragePage() {
  const storageData = [
    { 
      id: 1, 
      name: "/", 
      filesystem: "/dev/sda1", 
      size: "120GB", 
      used: "28GB", 
      available: "86GB", 
      usage: 25,
      mountpoint: "/" 
    },
    { 
      id: 2, 
      name: "/boot/efi", 
      filesystem: "/dev/sda2", 
      size: "512MB", 
      used: "7.8MB", 
      available: "504MB", 
      usage: 2,
      mountpoint: "/boot/efi" 
    },
    { 
      id: 3, 
      name: "/home", 
      filesystem: "/dev/sda3", 
      size: "200GB", 
      used: "45GB", 
      available: "155GB", 
      usage: 23,
      mountpoint: "/home" 
    },
  ];

  const directoryData = [
    { name: "bin", size: "12MB", type: "directory", modified: "2024-01-15" },
    { name: "boot", size: "256MB", type: "directory", modified: "2024-01-10" },
    { name: "etc", size: "45MB", type: "directory", modified: "2024-01-20" },
    { name: "home", size: "45GB", type: "directory", modified: "2024-01-21" },
    { name: "usr", size: "8.2GB", type: "directory", modified: "2024-01-18" },
    { name: "var", size: "2.1GB", type: "directory", modified: "2024-01-21" },
  ];

  return (
    <div className="flex-1 space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Storage Management</h1>
        <p className="text-muted-foreground">
          Monitor disk usage and manage file systems
        </p>
      </div>

      {/* Disk Usage Overview */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {storageData.map((disk) => (
          <Card key={disk.id} className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <HardDrive className="h-6 w-6 text-primary" />
              <div>
                <h3 className="font-semibold">{disk.name}</h3>
                <p className="text-sm text-muted-foreground">{disk.filesystem}</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <Progress value={disk.usage} className="w-full" />
              <div className="text-sm">
                <div className="flex justify-between">
                  <span>Used: {disk.used}</span>
                  <span>{disk.usage}%</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Available: {disk.available}</span>
                  <span>Total: {disk.size}</span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* File Browser */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">File System Browser</h3>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="gap-2">
              <Plus className="h-4 w-4" />
              New Folder
            </Button>
            <Button size="sm" variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Download
            </Button>
          </div>
        </div>
        
        <div className="text-sm text-muted-foreground mb-4">
          Current path: <span className="font-mono">/</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Name</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Type</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Size</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Modified</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {directoryData.map((item, index) => (
                <tr key={index} className="border-b border-muted hover:bg-muted/30">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {item.type === "directory" ? (
                        <Folder className="h-4 w-4 text-primary" />
                      ) : (
                        <File className="h-4 w-4 text-muted-foreground" />
                      )}
                      <span className="font-medium">{item.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 capitalize">{item.type}</td>
                  <td className="px-4 py-3">{item.size}</td>
                  <td className="px-4 py-3 text-muted-foreground">{item.modified}</td>
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