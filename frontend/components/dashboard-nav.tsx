"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, Laptop, LogOut } from "lucide-react"

export default function DashboardNav() {
  const pathname = usePathname()

  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4">
        <div className="ml-auto flex items-center space-x-4">
          <nav className="flex items-center space-x-2">
            <Link href="/dashboard">
              <Button
                variant={pathname === "/dashboard" ? "default" : "ghost"}
                size="sm"
                className="flex items-center gap-1"
              >
                <LayoutDashboard className="h-4 w-4" />
                <span>Dashboard</span>
              </Button>
            </Link>
            <Link href="/dashboard/devices">
              <Button
                variant={pathname === "/dashboard/devices" ? "default" : "ghost"}
                size="sm"
                className="flex items-center gap-1"
              >
                <Laptop className="h-4 w-4" />
                <span>Devices</span>
              </Button>
            </Link>
          </nav>
          <Link href="/api/auth/logout">
            <Button variant="ghost" size="icon">
              <LogOut className="h-5 w-5" />
              <span className="sr-only">Logout</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
