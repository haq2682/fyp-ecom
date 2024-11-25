"use server";
import prisma from "@/db";
import { User } from "@prisma/client";

export const getCustomers = async (): Promise<User[]> => {
    try {
        const result: User[] = await prisma.$queryRaw`SELECT * FROM User AS customers WHERE customers.role = 'customer' LIMIT 10`;
        return result;
    }
    catch (error) {
        return error;
    }
}