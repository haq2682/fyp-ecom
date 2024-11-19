'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { LayoutDashboard, Package, ShoppingCart, Users, Star, Settings, Plus, Menu, X, ChevronDown } from 'lucide-react'
import Link from "next/link"
import { usePathname } from 'next/navigation'
import { BarChart, Bar, LineChart, Line, ResponsiveContainer } from 'recharts'

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  const salesData = Array.from({ length: 30 }, () => ({
    value: Math.floor(Math.random() * 300) + 100
  }))

  const customerData = Array.from({ length: 30 }, () => ({
    value: Math.floor(Math.random() * 100) + 50
  }))

  const recentOrders = [
    {
      item: "Mens Black T-Shirts",
      date: "20 Mar, 2023",
      total: "$75.00",
      status: "Processing"
    },
    {
      item: "Essential Neutrals",
      date: "19 Mar, 2023",
      total: "$22.00",
      status: "Processing"
    },
    {
      item: "Sleek and Cozy Black",
      date: "7 Feb, 2023",
      total: "$57.00",
      status: "Completed"
    },
    {
      item: "MOCKUP Black",
      date: "29 Jan, 2023",
      total: "$30.00",
      status: "Completed"
    },
    {
      item: "Monochromatic Wardrobe",
      date: "27 Jan, 2023",
      total: "$27.00",
      status: "Completed"
    }
  ]

  const bestSelling = [
    { name: "Classic Monochrome Tees", sales: "$940" },
    { name: "Monochromatic Wardrobe", sales: "$790" },
    { name: "Essential Neutrals", sales: "$740" }
  ]

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen)

  return (
    <div className="flex h-screen bg-background">

      <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-50 w-64 bg-card border-r transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static`}>
        <div className="p-4 border-b flex justify-between items-center">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Package className="h-6 w-6" />
            Admin
          </h1>
          <Button variant="ghost" size="icon" onClick={toggleSidebar} className="lg:hidden">
            <X className="h-6 w-6" />
          </Button>
        </div>
        <nav className="p-4 space-y-2">
          <Link 
            href="/admin/dashboard" 
            className={`flex items-center gap-3 px-3 py-2 text-sm rounded-lg hover:bg-secondary ${pathname === '/dashboard' ? 'bg-secondary' : ''}`}
          >
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Link>
          <Link 
            href="/admin/products" 
            className={`flex items-center gap-3 px-3 py-2 text-sm rounded-lg hover:bg-secondary ${pathname === '/products' ? 'bg-secondary' : ''}`}
          >
            <Package className="h-4 w-4" />
            Products
          </Link>
          <Link 
            href="/admin/orders" 
            className={`flex items-center gap-3 px-3 py-2 text-sm rounded-lg hover:bg-secondary ${pathname === '/orders' ? 'bg-secondary' : ''}`}
          >
            <ShoppingCart className="h-4 w-4" />
            Orders
          </Link>
          <Link 
            href="/customers" 
            className={`flex items-center gap-3 px-3 py-2 text-sm rounded-lg hover:bg-secondary ${pathname === '/customers' ? 'bg-secondary' : ''}`}
          >
            <Users className="h-4 w-4" />
            Customers
          </Link>
          <Link 
            href="/reviews" 
            className={`flex items-center gap-3 px-3 py-2 text-sm rounded-lg hover:bg-secondary ${pathname === '/reviews' ? 'bg-secondary' : ''}`}
          >
            <Star className="h-4 w-4" />
            Reviews
          </Link>
          <Link 
            href="/settings" 
            className={`flex items-center gap-3 px-3 py-2 text-sm rounded-lg hover:bg-secondary ${pathname === '/settings' ? 'bg-secondary' : ''}`}
          >
            <Settings className="h-4 w-4" />
            Settings
          </Link>
        </nav>
      </div>

  
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="border-b">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={toggleSidebar} className="lg:hidden">
                <Menu className="h-6 w-6" />
              </Button>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>Admin</span>
                <ChevronDown className="h-4 w-4" />
                <span>Dashboard</span>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          <div className="grid gap-6">
        
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
                  <span className="text-xs text-muted-foreground">THIS MONTH</span>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$4,235</div>
                  <div className="h-[80px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={salesData}>
                        <Bar dataKey="value" fill="currentColor" className="fill-primary" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Customers</CardTitle>
                  <span className="text-xs text-muted-foreground">THIS MONTH</span>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">2,571</div>
                  <div className="h-[80px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={customerData}>
                        <Line type="monotone" dataKey="value" stroke="currentColor" strokeWidth={2} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Orders</CardTitle>
                  <span className="text-xs text-muted-foreground">MONTHLY GOALS: 1,000</span>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">734</div>
                  <div className="mt-4 h-2 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: '73.4%' }} />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">266 left to goal</p>
                </CardContent>
              </Card>
            </div>

        
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Best Selling</CardTitle>
                  <span className="text-xs text-muted-foreground">THIS MONTH</span>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold mb-4">$2,400</div>
                  <div className="space-y-4">
                    {bestSelling.map((item) => (
                      <div key={item.name} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-primary" />
                          <span>{item.name}</span>
                        </div>
                        <span>{item.sales} Sales</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Recent Orders</CardTitle>
                  <Button variant="ghost" className="text-xs">View All</Button>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Item</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentOrders.map((order) => (
                        <TableRow key={order.item}>
                          <TableCell>{order.item}</TableCell>
                          <TableCell>{order.date}</TableCell>
                          <TableCell>{order.total}</TableCell>
                          <TableCell>
                            <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${
                              order.status === 'Completed' 
                                ? 'bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20' 
                                : 'bg-yellow-50 text-yellow-700 ring-1 ring-inset ring-yellow-600/20'
                            }`}>
                              {order.status}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}