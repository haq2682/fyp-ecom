'use client'

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { BarChart, Bar, LineChart, Line, ResponsiveContainer } from 'recharts'
import { getSalesData, getTotalCustomers, type SalesPeriod } from "@/actions/getSalesData"
import { getRecentOrders } from "@/actions/getRecentOrders"
import { Order } from '@prisma/client'
import Loading from "@/components/ui/loading"

export default function DashboardPage() {
  const [salesPeriod, setSalesPeriod] = useState<SalesPeriod>('monthly')
  const [salesCount, setSalesCount] = useState<number>(0)
  const [customerCount, setCustomerCount] = useState<number>(0)
  const [recentOrders, setRecentOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchDashboardData = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const [salesResult, customersResult, ordersResult] = await Promise.all([
        getSalesData(salesPeriod),
        getTotalCustomers(),
        getRecentOrders()
      ])

      if (typeof salesResult === 'number') {
        setSalesCount(salesResult)
      } else {
        console.error('Unexpected sales data format:', salesResult)
        setError('Failed to fetch sales data')
      }

      if (typeof customersResult === 'number') {
        setCustomerCount(customersResult)
      } else {
        console.error('Unexpected customer data format:', customersResult)
        setError(prev => prev ? `${prev}. Failed to fetch customer data` : 'Failed to fetch customer data')
      }

      if (Array.isArray(ordersResult)) {
        setRecentOrders(ordersResult)
      } else {
        console.error('Unexpected orders data format:', ordersResult)
        setError(prev => prev ? `${prev}. Failed to fetch recent orders` : 'Failed to fetch recent orders')
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err)
      setError('An unexpected error occurred. Please try again later.')
    } finally {
      setIsLoading(false)
    }
  }, [salesPeriod])

  useEffect(() => {
    fetchDashboardData()
  }, [fetchDashboardData])

  const customerData = Array.from({ length: 30 }, () => ({
    value: Math.floor(Math.random() * 100) + 50
  }))

  const salesData = Array.from({ length: 30 }, () => ({
    value: Math.floor(Math.random() * 100) + 50
  }))

  const bestSelling = [
    { name: "Classic Monochrome Tees", sales: "$940" },
    { name: "Monochromatic Wardrobe", sales: "$790" },
    { name: "Essential Neutrals", sales: "$740" }
  ]

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'processing':
        return 'bg-yellow-50 text-yellow-700 ring-yellow-600/20'
      case 'shipped':
        return 'bg-blue-50 text-blue-700 ring-blue-600/20'
      case 'delivered':
        return 'bg-green-50 text-green-700 ring-green-600/20'
      default:
        return 'bg-gray-50 text-gray-700 ring-gray-600/20'
    }
  }

  return (
    <div className="container mx-auto mt-12">
      {isLoading ? (
        <div className="flex justify-center items-center h-screen">
          <Loading />
        </div>
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : (
        <>
          <header className="flex justify-between items-center mb-4">
            <h2 className="text-3xl font-bold">Dashboard</h2>
          </header>

          <div className="grid gap-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
                  <Select value={salesPeriod} onValueChange={(value: SalesPeriod) => setSalesPeriod(value)}>
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="Select period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="yearly">Yearly</SelectItem>
                    </SelectContent>
                  </Select>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    ${salesCount.toLocaleString()}
                  </div>
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
                  <span className="text-xs text-muted-foreground">TOTAL ACTIVE</span>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {customerCount.toLocaleString()}
                  </div>
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
                        <TableHead>Order Number</TableHead>
                        <TableHead className="hidden md:table-cell">Date</TableHead>
                        <TableHead>Total Amount</TableHead>
                        <TableHead className="hidden sm:table-cell">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentOrders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">
                            {order.orderNumber}
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell>${order.totalAmount.toFixed(2)}</TableCell>
                          <TableCell className="hidden sm:table-cell">
                            <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${getStatusColor(order.status)}`}>
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
        </>
      )}
    </div>
  )
}
