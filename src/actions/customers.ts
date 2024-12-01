"use server";
import prisma from "@/db"; import { PaginatedCustomers } from "@/types";
import { User } from "@prisma/client";

export const getCustomers = async (searchQuery: string | null, currentPage: number = 1, limit: number = 10): Promise<PaginatedCustomers> => {
    try {
        const offset: number = (currentPage - 1) * limit;
        if (searchQuery) {
            const result: User[] = await prisma.$queryRaw`SELECT * FROM User AS customers WHERE customers.role = 'customer' AND (customers.username LIKE ${'%' + searchQuery + '%'} OR customers.email LIKE ${'%' + searchQuery + '%'}) LIMIT ${limit} OFFSET ${offset};`;
            const total: number = await prisma.$queryRaw`SELECT COUNT(*) FROM User AS customers WHERE customers.role = 'customer' AND (customers.username LIKE ${'%' + searchQuery + '%'} OR customers.email LIKE ${'%' + searchQuery + '%'}) LIMIT ${limit} OFFSET ${offset};`;
            const totalPages: number = Math.ceil(total / limit);
            return { result, total, totalPages }
        }
        else {
            const result: User[] = await prisma.$queryRaw`SELECT * FROM User WHERE role = 'customer' LIMIT ${limit} OFFSET ${offset}`;
            const totalResult: { customers_length: number }[] = await prisma.$queryRaw`SELECT COUNT(*) AS customers_length FROM User WHERE role = 'customer'`;
            const total: number = Number(totalResult[0].customers_length);
            const totalPages: number = Math.ceil(total / limit);
            console.log(totalPages);
            return { result, total, totalPages };
        }
    }
    catch (error) {
        throw new Error('An unexpected error occurred');
    }
}