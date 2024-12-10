'use server'

import prisma from "@/db";

export type SalesPeriod = 'daily' | 'monthly' | 'yearly'

export const getSalesData = async (period: SalesPeriod): Promise<number> => {
  try {
    let result;
    
    switch (period) {
      case 'daily':
        result = await prisma.$queryRaw<[{ total_sales: number }]>`
          SELECT COALESCE(SUM(total_daily_sales), 0) as total_sales
          FROM total_daily_sales
        `;
        break;
      case 'monthly':
        result = await prisma.$queryRaw<[{ total_sales: number }]>`
          SELECT COALESCE(SUM(total_monthly_sales), 0) as total_sales
          FROM total_monthly_sales
        `;
        break;
      case 'yearly':
        result = await prisma.$queryRaw<[{ total_sales: number }]>`
          SELECT COALESCE(SUM(total_yearly_sales), 0) as total_sales
          FROM total_yearly_sales
        `;
        break;
      default:
        throw new Error('Invalid period');
    }

    return result[0].total_sales;
  } catch (error) {
    console.error('Error fetching sales data:', error);
    throw new Error('Failed to fetch sales data');
  }
}

export const getTotalCustomers = async (): Promise<number> => {
  try {
    const result = await prisma.$queryRaw<[{ count: bigint }]>`
      SELECT COUNT(*) as count
      FROM "User"
      WHERE role = 'customer'
    `;
    return Number(result[0].count);
  } catch (error) {
    console.error('Error fetching customer count:', error);
    throw new Error('Failed to fetch customer data');
  }
}