'use server'

import prisma from "@/db"
import { revalidatePath } from "next/cache"
import { Order, PaginatedOrders } from "@/types"
import { Status } from "@prisma/client"

export const createOrder = async (orderData: Omit<Order, 'id' | 'createdAt'>): Promise<Order> => {
  try {
    const result = await prisma.order.create({
      data: {
        orderNumber: orderData.orderNumber,
        totalAmount: orderData.totalAmount,
        status: orderData.status,
        userId: orderData.userId,
      },
    })

    revalidatePath('/orders')
    return {
      ...result,
      orderNumber: result.orderNumber,
      totalAmount: Number(result.totalAmount),
    }
  } catch (error) {
    console.error("Error creating order:", error)
    throw new Error("Failed to create order")
  }
}

export const updateOrder = async (orderId: number, orderData: Partial<Order>): Promise<Order> => {
  try {
    const result = await prisma.order.update({
      where: { id: orderId },
      data: {
        totalAmount: orderData.totalAmount
          ? { set: Number(orderData.totalAmount) }
          : undefined,
        status: orderData.status as Status,
      },
    })

    revalidatePath('/orders')
    return {
      ...result,
      orderNumber: result.orderNumber,
      totalAmount: Number(result.totalAmount),
    }
  } catch (error) {
    console.error("Error updating order:", error)
    throw new Error("Failed to update order")
  }
}

export const deleteOrder = async (orderId: number): Promise<{ success: boolean }> => {
  try {
    await prisma.$executeRaw`
      DELETE FROM "Order"
      WHERE "id" = ${orderId}
    `

    revalidatePath('/orders')
    return { success: true }
  } catch (error) {
    console.error("Error deleting order:", error)
    throw new Error("Failed to delete order")
  }
}

export const getOrders = async (searchQuery: string | null, currentPage: number = 1, limit: number = 10): Promise<PaginatedOrders> => {
  try {
    const offset: number = (currentPage - 1) * limit
    let result: Array<{
      id: number;
      orderNumber: bigint;
      createdAt: Date;
      totalAmount: bigint;
      status: Status;
      userId: number;
    }>
    let totalResult

    if (searchQuery) {
      result = await prisma.$queryRaw`
        SELECT id, "orderNumber", createdAt, "totalAmount", "status", "userId" 
        FROM "Order"
        WHERE "orderNumber" LIKE ${'%' + searchQuery + '%'}
          OR "totalAmount"::text LIKE ${'%' + searchQuery + '%'}
          OR "status"::text LIKE ${'%' + searchQuery + '%'}
        ORDER BY createdAt DESC
        LIMIT ${limit} OFFSET ${offset}
      `
      totalResult = await prisma.$queryRaw<[{ orders_count: bigint }]>`
        SELECT COUNT(*) as orders_count 
        FROM "Order"
        WHERE "orderNumber" LIKE ${'%' + searchQuery + '%'}
          OR "totalAmount"::text LIKE ${'%' + searchQuery + '%'}
          OR "status"::text LIKE ${'%' + searchQuery + '%'}
      `
    } else {
      result = await prisma.$queryRaw`
        SELECT id, "orderNumber", createdAt, "totalAmount", "status", "userId" 
        FROM "Order"
        ORDER BY createdAt DESC
        LIMIT ${limit} OFFSET ${offset}
      `
      totalResult = await prisma.$queryRaw<[{ orders_count: bigint }]>`
        SELECT COUNT(*) AS orders_count FROM "Order"
      `
    }

    const formattedResult: Order[] = result.map(order => ({
      ...order,
      orderNumber: order.orderNumber,
      totalAmount: Number(order.totalAmount),
    }))

    const total: number = Number(totalResult[0].orders_count)
    const totalPages: number = Math.ceil(total / limit)

    return {
      result: formattedResult,
      total,
      totalPages,
    }
  } catch (error) {
    console.error('Error fetching orders:', error)
    return {
      result: [],
      total: 0,
      totalPages: 0,
    }
  }
}

