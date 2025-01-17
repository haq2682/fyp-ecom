import { User } from "@prisma/client"

export type typeResponseError = {
    message: string,
    status: number
}

export type PaginatedCustomers = {
    result: User[],
    total: number,
    totalPages: number
}

import { Status } from '@prisma/client';

export interface Order {
    id: number;
    orderNumber: bigint;
    createdAt: Date;
    totalAmount: number;
    status: Status;
    userId: number;
}

export interface FormattedOrder {
    id: number;
    orderNumber: string;
    createdAt: Date;
    totalAmount: number;
    status: Status;
    userId: number;
}

export interface PaginatedOrders {
    result: Order[];
    total: number;
    totalPages: number;
}