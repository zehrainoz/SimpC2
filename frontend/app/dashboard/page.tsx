import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Laptop, Server, Signal } from "lucide-react"
import DashboardNav from "@/components/dashboard-nav"

export default function Dashboard() {
  // This would be fetched from your Go backend in a real application
  const mockStats = {
    registeredDevices: 128,
    onlineDevices: 87,
    serverUptime: "7d 14h 23m",
    lastUpdate: new Date().toLocaleTimeString(),
  }

  return (
    <main className="flex min-h-screen flex-col">
      <DashboardNav />

      <div className="flex-1 space-y-8 p-8 pt-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <div className="flex items-center gap-2">
            <p className="text-sm text-muted-foreground">Last updated: {mockStats.lastUpdate}</p>
            <Button variant="outline" size="sm">
              Refresh
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Registered Devices</CardTitle>
              <Laptop className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockStats.registeredDevices}</div>
              <p className="text-xs text-muted-foreground">Total devices in the system</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Online Devices</CardTitle>
              <Signal className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockStats.onlineDevices}</div>
              <p className="text-xs text-muted-foreground">Currently connected</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Server Uptime</CardTitle>
              <Server className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockStats.serverUptime}</div>
              <p className="text-xs text-muted-foreground">Since last restart</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Link href="/dashboard/devices" className="block">
            <Card className="h-full overflow-hidden transition-all hover:shadow-lg">
              <CardContent className="p-0">
                <div className="bg-gradient-to-r from-green-400 to-teal-500 p-6 text-white">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold">Devices</h3>
                    <Laptop className="h-6 w-6" />
                  </div>
                  <p className="mt-2 text-sm opacity-90">View and manage all connected devices</p>
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{mockStats.registeredDevices} total devices</span>
                    <span className="text-sm font-medium">View All →</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </main>
  )
}
