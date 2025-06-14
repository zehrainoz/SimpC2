"use client"

import { Suspense } from "react";
import DashboardNav from "@/components/dashboard-nav";
import DevicesTable from "@/components/devices-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Laptop, RefreshCw, Download } from "lucide-react";
import { useDevices } from "@/hooks/useDevices";

export default function DevicesPage() {
  const { devices, loading, error } = useDevices();

  if (loading) {
    return (
      <main className="flex min-h-screen flex-col">
        <DashboardNav />
        <div className="flex-1 space-y-6 p-8 pt-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h1 className="text-3xl font-bold tracking-tight">Devices</h1>
              <p className="text-muted-foreground">Manage and monitor all connected devices</p>
            </div>
          </div>
          <div>Loading...</div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex min-h-screen flex-col">
        <DashboardNav />
        <div className="flex-1 space-y-6 p-8 pt-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h1 className="text-3xl font-bold tracking-tight">Devices</h1>
              <p className="text-muted-foreground">Manage and monitor all connected devices</p>
            </div>
          </div>
          <div>Error: {error}</div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col">
      <DashboardNav />

      <div className="flex-1 space-y-6 p-8 pt-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">Devices</h1>
            <p className="text-muted-foreground">Manage and monitor all connected devices</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" 
              size="sm" 
              className="flex items-center gap-1"
              onClick={() => window.location.reload()}
            >
              <RefreshCw className="h-4 w-4" />
              <span>Refresh</span>
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex w-full max-w-sm items-center space-x-2">
            <Input type="text" placeholder="Search devices..." />
            <Button type="submit">Search</Button>
          </div>
          <div className="flex items-center gap-2">
            <Select defaultValue="all">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Devices</SelectItem>
                <SelectItem value="online">Online</SelectItem>
                <SelectItem value="offline">Offline</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Suspense fallback={<div>Loading devices...</div>}>
          <DevicesTable devices={devices} />
        </Suspense>
      </div>
    </main>
  );
}
