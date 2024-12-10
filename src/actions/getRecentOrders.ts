'use server'

import prisma from "@/db";
import { Order } from "@prisma/client";

export const getRecentOrders = async (): Promise<Order[]> => {
  try {
    const result = await prisma.$queryRaw<Order[]>`
      SELECT id, orderNumber, createdAt, totalAmount, status 
      FROM "Order"
      ORDER BY createdAt DESC
      LIMIT 5
    `;
    
    // Convert BigInt to Number for totalAmount
    return result.map(order => ({
      ...order,
      totalAmount: Number(order.totalAmount)
    }));
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw new Error("Failed to fetch recent orders");
  }
}