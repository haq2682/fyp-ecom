"use server";
import prisma from "@/db"; import { User } from "@prisma/client";

export const getCustomers = async (searchQuery: string | null): Promise<User[]> => {
    try {
        if (searchQuery) {
            const result: User[] = await prisma.$queryRaw`
                SELECT * FROM User AS customers WHERE customers.role = 'customer' AND (customers.username LIKE ${'%' + searchQuery + '%'} OR customers.email LIKE ${'%' + searchQuery + '%'}) LIMIT 10;`
            return result;
        }
        else {
            const result: User[] = await prisma.$queryRaw`SELECT * FROM User AS customers WHERE customers.role = 'customer' LIMIT 10`;
            return result;
        }
    }
    catch (error) {
        throw new Error('An unexpected error occurred');
    }
}