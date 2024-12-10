'use client'

import { useEffect, useState, useCallback } from "react"
import { getOrders } from "@/actions/OrderActions"
import { createOrder } from "@/actions/OrderActions"
import { useTransition } from 'react'
import { Order } from "@prisma/client"
import OrdersTable from "@/components/dashboard/order/table"
import OrderSearch from "@/components/dashboard/order/search"
import OrdersPagination from "@/components/dashboard/order/pagination"
import { useSearchParams, useRouter } from "next/navigation"
import Loading from "@/components/ui/loading"
import { Button } from "@/components/ui/button"
import { Plus } from 'lucide-react'

export default function Orders() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const searchQuery = searchParams.get('query') || ''
    const currentPage = Number(searchParams.get('page')) || 1
    const [orders, setOrders] = useState<Order[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [isPending, startTransition] = useTransition()
    const [totalPages, setTotalPages] = useState<number>(1)

    const fetchOrdersData = useCallback(async () => {
        setIsLoading(true)
        setError(null)
        try {
            const response = await getOrders(searchQuery, currentPage)
            setOrders(response.result)
            setTotalPages(response.totalPages)
        } catch (error) {
            console.error(error)
            setError('Failed to fetch orders. Please try again later.')
        } finally {
            setIsLoading(false)
        }
    }, [searchQuery, currentPage])

    useEffect(() => {
        fetchOrdersData()
    }, [fetchOrdersData])

    const handleCreateOrder = async () => {
      startTransition(async () => {
        try {
          const newOrder = await createOrder({
            orderNumber: BigInt(Date.now()),
            totalAmount: 0,
            status: 'placed',
            userId: 1, 
          })
          await fetchOrdersData() 
        } catch (error) {
          console.error('Failed to create order:', error)
          setError('Failed to create order. Please try again.')
        }
      })
    }

    const handleSearch = (query: string) => {
      router.push(`/orders?query=${encodeURIComponent(query)}&page=1`)
    }

    return (
        <div className="container mx-auto mt-12">
            <h2 className="text-2xl font-bold mb-4">Orders</h2>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <OrderSearch onSearch={handleSearch} />
              <Button className="w-full sm:w-auto" onClick={handleCreateOrder} disabled={isPending}>
                <Plus className="mr-2 h-4 w-4" />
                Create order
              </Button>
            </div>
            <div className="flex justify-center items-center">
                {isLoading && <Loading />}
                {error && <p className="text-red-500">{error}</p>}
                {!isLoading && !error && <OrdersTable orders={orders} setOrders={setOrders} />}
            </div>
            <div className="mt-12">
                <OrdersPagination totalPages={totalPages} currentPage={currentPage} setIsLoading={setIsLoading} />
            </div>
        </div>
    )
}
