import { User } from "@prisma/client"
import { Status } from '@prisma/client';

export type typeResponseError = {
    message: string,
    status: number
}

export type PaginatedCustomers = {
    result: User[],
    total: number,
    totalPages: number
}

export type Product = {
    id: number,
    name: string,
    sku: string,
    price: number,
    stock: string,
    category: string,
    image: string
}

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

export interface HomeProduct {
    id: string,
    inStock: boolean,
    price: number,
    discountedPrice: number,
    currency: string,
    imageSrc: string,
    imageAlt: string,
    title: string,
}