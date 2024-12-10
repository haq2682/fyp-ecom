'use server'

import prisma from "@/db";
import { revalidatePath } from "next/cache";
import { Order, Prisma,Status } from "@prisma/client";

export type PaginatedOrders = {
  result: {
    id: number;
    orderNumber: string;
    createdAt: Date;
    totalAmount: number;
    status: Status;
  }[];
  total: number;
  totalPages: number;
}

export const createOrder = async (orderData: Omit<Order, 'id' | 'createdAt'>): Promise<Order> => {
  try {
    const result = await prisma.order.create({
      data: {
        orderNumber: orderData.orderNumber,
        totalAmount: orderData.totalAmount,
        status: orderData.status,
        userId: orderData.userId,
      },
    });

    revalidatePath('/orders');
    return result;
  } catch (error) {
    console.error("Error creating order:", error);
    throw new Error("Failed to create order");
  }
};

export const updateOrder = async (orderId: number, orderData: Partial<Order>): Promise<Order> => {
  try {
    const result = await prisma.order.update({
      where: { id: orderId },
      data: {
        totalAmount: orderData.totalAmount ? new Prisma.Decimal(orderData.totalAmount.toString()) : undefined,
        status: orderData.status,
      },
    });

    revalidatePath('/orders');
    return result;
  } catch (error) {
    console.error("Error updating order:", error);
    throw new Error("Failed to update order");
  }
};
export const deleteOrder = async (orderId: number): Promise<{ success: boolean }> => {
  try {
    await prisma.$executeRaw`
      DELETE FROM "Order"
      WHERE "id" = ${orderId}
    `;

    revalidatePath('/orders');
    return { success: true };
  } catch (error) {
    console.error("Error deleting order:", error);
    throw new Error("Failed to delete order");
  }
};

export const getOrders = async (searchQuery: string | null, currentPage: number = 1, limit: number = 10): Promise<PaginatedOrders> => {
  try {
    const offset: number = (currentPage - 1) * limit;
    let result: Order[];
    let totalResult;

    if (searchQuery) {
      result = await prisma.$queryRaw`
        SELECT "orderNumber", createdAt, "totalAmount", "status" 
        FROM "Order"
        WHERE orderNumber LIKE ${'%' + searchQuery + '%'}
          OR totalAmount LIKE ${'%' + searchQuery + '%'}
          OR status  LIKE ${'%' + searchQuery + '%'}
        ORDER BY createdAt DESC
        LIMIT ${limit} OFFSET ${offset}
      `;
      totalResult = await prisma.$queryRaw<[{ orders_count: BigInt }]>`
        SELECT COUNT(*) as orders_count 
        FROM "Order"
        WHERE orderNumber  LIKE ${'%' + searchQuery + '%'}
          OR totalAmount  LIKE ${'%' + searchQuery + '%'}
          OR status LIKE ${'%' + searchQuery + '%'}
      `;
    } else {
      result = await prisma.$queryRaw<Order[]>`
        SELECT orderNumber, createdAt, totalAmount, status 
        FROM "Order"
        ORDER BY createdAt DESC
        LIMIT ${limit} OFFSET ${offset}
      `;
      totalResult = await prisma.$queryRaw<[{ orders_count: BigInt }]>`
        SELECT COUNT(*) AS orders_count FROM "Order"
      `;
    }

    const formattedResult = result.map(order => ({
      ...order,
      orderNumber: order.orderNumber.toString(),
      totalAmount: Number(order.totalAmount)
    }));

    const total: number = Number(totalResult[0].orders_count);
    const totalPages: number = Math.ceil(total / limit);

    return { 
      result: formattedResult, 
      total, 
      totalPages 
    };
  } catch (error) {
    console.error('Error fetching orders:', error);
    return {
      result: [],
      total: 0,
      totalPages: 0
    };
  }
}
