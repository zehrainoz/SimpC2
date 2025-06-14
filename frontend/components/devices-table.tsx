// components/DevicesTable.tsx
import React, { useState } from "react";
import type { Device } from "../lib/types"; // Adjust the path as needed
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ChevronDown, Play, Upload, Terminal } from "lucide-react";

type DevicesTableProps = {
  devices: Device[];
};

const DevicesTable: React.FC<DevicesTableProps> = ({ devices }) => {
  const [selectedDevices, setSelectedDevices] = useState<string[]>([]);
  const [commandDialogOpen, setCommandDialogOpen] = useState(false);
  const [fileDialogOpen, setFileDialogOpen] = useState(false);
  const [shellDialogOpen, setShellDialogOpen] = useState(false);
  const [command, setCommand] = useState("");
  const [shellOutput, setShellOutput] = useState("$ ");

  // Handle device selection
  const toggleDevice = (id: string) => {
    setSelectedDevices((prev) => {
      if (prev.includes(id)) {
        return prev.filter((deviceId) => deviceId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  // Handle command execution
  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(`Executing command "${command}" on ${selectedDevices.length} devices`);
    setCommandDialogOpen(false);
    setCommand("");
  };

  // Handle file upload
  const handleFileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(`Sending file to ${selectedDevices.length} devices`);
    setFileDialogOpen(false);
  };

  // Handle shell
  const handleShellSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(`Running shell on ${selectedDevices.length} device(s)`);
    setShellDialogOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between bg-muted/50 p-2 rounded-md">
        <div className="text-sm font-medium">
          {selectedDevices.length} {selectedDevices.length === 1 ? "device" : "devices"} selected
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-1" disabled={selectedDevices.length === 0}>
              Actions <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setCommandDialogOpen(true)}>
              <Play className="mr-2 h-4 w-4" />
              Run a command
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFileDialogOpen(true)}>
              <Upload className="mr-2 h-4 w-4" />
              Send File
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => selectedDevices.length === 1 && setShellDialogOpen(true)}
              disabled={selectedDevices.length > 1}
              className={selectedDevices.length > 1 ? "text-muted-foreground" : ""}
            >
              <Terminal className="mr-2 h-4 w-4" />
              Get Shell
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="overflow-x-auto rounded-lg shadow-lg border border-gray-200">
        <table className="min-w-full text-sm text-left text-gray-700">
          <thead className="bg-gray-100 text-xs uppercase text-gray-600">
            <tr>
              <th className="px-6 py-3">
                <Checkbox
                  checked={selectedDevices.length === devices.length}
                  onCheckedChange={() => {
                    if (selectedDevices.length === devices.length) {
                      setSelectedDevices([]);
                    } else {
                      setSelectedDevices(devices.map((device) => device.mac_address));
                    }
                  }}
                />
              </th>
              <th className="px-6 py-3">Hostname</th>
              <th className="px-6 py-3">OS</th>
              <th className="px-6 py-3">Architecture</th>
              <th className="px-6 py-3">MAC Address</th>
              <th className="px-6 py-3">IP Address</th>
              <th className="px-6 py-3">Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {devices.map((device, index) => (
              <tr key={index} className="border-t border-gray-200 hover:bg-gray-50">
                <td className="px-6 py-4">
                  <Checkbox
                    checked={selectedDevices.includes(device.mac_address)}
                    onCheckedChange={() => toggleDevice(device.mac_address)}
                  />
                </td>
                <td className="px-6 py-4">{device.host_name}</td>
                <td className="px-6 py-4">{device.os}</td>
                <td className="px-6 py-4">{device.architecture}</td>
                <td className="px-6 py-4">{device.mac_address}</td>
                <td className="px-6 py-4">{device.ip_address}</td>
                <td className="px-6 py-4">{device.timestamp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Command Dialog */}
      <Dialog open={commandDialogOpen} onOpenChange={setCommandDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Run Command</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCommandSubmit}>
            <div className="space-y-2">
              <label htmlFor="command">Command</label>
              <input
                id="command"
                type="text"
                value={command}
                onChange={(e) => setCommand(e.target.value)}
                placeholder="Enter command"
                className="input"
                required
              />
            </div>
            <DialogFooter>
              <Button type="submit">Execute</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* File Upload Dialog */}
      <Dialog open={fileDialogOpen} onOpenChange={setFileDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload File</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleFileSubmit}>
            <div className="space-y-2">
              <label htmlFor="file">File</label>
              <input type="file" id="file" className="input" required />
            </div>
            <DialogFooter>
              <Button type="submit">Upload</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Shell Dialog */}
<Dialog open={shellDialogOpen} onOpenChange={setShellDialogOpen}>
  <DialogContent className="max-w-2xl">
    <DialogHeader>
      <DialogTitle>Interactive Shell</DialogTitle>
    </DialogHeader>
    <div className="h-64 overflow-y-auto bg-black text-green-400 font-mono text-sm p-4 rounded-md border border-gray-700 whitespace-pre-wrap">
      <div>
        {shellOutput}
        <span className="text-green-400">$ </span>
        <input
          type="text"
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              // Simulate sending the command and appending output
              const newOutput = `${shellOutput}\n$ ${command}\n<output here>`;
              setShellOutput(newOutput);
              setCommand("");
            }
          }}
          className="bg-black text-green-400 font-mono border-none outline-none w-full"
          autoFocus
        />
      </div>
    </div>
  </DialogContent>
</Dialog>

    </div>
  );
};

export default DevicesTable;
