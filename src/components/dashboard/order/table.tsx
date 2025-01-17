'use client'

import React, { useState } from "react"
import { Order, Status } from "@prisma/client"  // Import Status type
import { MoreHorizontal } from 'lucide-react'
import { Input } from "@/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { updateOrder, deleteOrder } from "@/actions/OrderActions"
import { useTransition } from 'react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

// Define order statuses with proper typing
const ORDER_STATUSES: Status[] = ['placed', 'processing', 'delivered', 'cancelled'] as Status[]

interface OrdersTableProps {
    orders: Order[]
    setOrders: React.Dispatch<React.SetStateAction<Order[]>>
}

export default function OrdersTable({
    orders,
    setOrders,
}: OrdersTableProps) {
    const [editingOrderId, setEditingOrderId] = useState<number | null>(null)
    const [editedOrder, setEditedOrder] = useState<Order | null>(null)
    const [isPending, startTransition] = useTransition()

    const handleEditClick = (order: Order) => {
        setEditingOrderId(order.id)
        setEditedOrder(order)
    }

    const handleDiscard = () => {
        setEditingOrderId(null)
        setEditedOrder(null)
    }

    const handleInputChange = (value: string, field: keyof Order) => {
        if (editedOrder) {
            setEditedOrder({ ...editedOrder, [field]: value })
        }
    }

    const handleSubmit = async () => {
        if (editedOrder) {
            startTransition(async () => {
                try {
                    const updatedOrder = await updateOrder(editedOrder.id, {
                        totalAmount: parseFloat(editedOrder.totalAmount.toString()),
                        status: editedOrder.status
                    })
                    setOrders(prevOrders =>
                        prevOrders.map(order =>
                            order.id === updatedOrder.id ? updatedOrder : order
                        )
                    )
                    setEditingOrderId(null)
                    setEditedOrder(null)
                } catch (error) {
                    console.error("Failed to update order:", error)
                }
            })
        }
    }

    const handleDelete = async (orderId: number) => {
        if (confirm("Are you sure you want to delete this order?")) {
            startTransition(async () => {
                try {
                    await deleteOrder(orderId)
                    setOrders(prevOrders => prevOrders.filter(order => order.id !== orderId))
                } catch (error) {
                    console.error("Failed to delete order:", error)
                }
            })
        }
    }

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="text-center">Order Number</TableHead>
                    <TableHead className="text-center">Created At</TableHead>
                    <TableHead className="text-center">Total Amount</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead className="text-center">Action</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {orders.map((order: Order) => (
                    <TableRow key={order.id} className="text-center">
                        <TableCell>{order.orderNumber.toString()}</TableCell>
                        <TableCell>
                            {new Date(order.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                            {editingOrderId === order.id ? (
                                <Input
                                    type="number"
                                    value={editedOrder?.totalAmount.toString()}
                                    onChange={(e) => handleInputChange(e.target.value, "totalAmount")}
                                />
                            ) : (
                                `$${parseFloat(order.totalAmount.toString()).toFixed(2)}`
                            )}
                        </TableCell>
                        <TableCell>
                            {editingOrderId === order.id ? (
                                <Select
                                    value={editedOrder?.status}
                                    onValueChange={(value: Status) => {
                                        if (editedOrder) {
                                            setEditedOrder({ ...editedOrder, status: value })
                                        }
                                    }}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {ORDER_STATUSES.map((status) => (
                                            <SelectItem key={status} value={status}>
                                                {status.charAt(0).toUpperCase() + status.slice(1)}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            ) : (
                                order.status
                            )}
                        </TableCell>
                        <TableCell>
                            <DropdownMenu>
                                <DropdownMenuTrigger>
                                    <MoreHorizontal />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    {editingOrderId === order.id ? (
                                        <>
                                            <DropdownMenuItem onClick={handleSubmit} disabled={isPending}>
                                                Save
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={handleDiscard}>
                                                Discard
                                            </DropdownMenuItem>
                                        </>
                                    ) : (
                                        <>
                                            <DropdownMenuItem onClick={() => handleEditClick(order)}>
                                                Edit
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onClick={() => handleDelete(order.id)}
                                                className="text-destructive"
                                                disabled={isPending}
                                            >
                                                Delete
                                            </DropdownMenuItem>
                                        </>
                                    )}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}