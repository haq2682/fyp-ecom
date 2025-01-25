import { User } from "@prisma/client"
import { Status } from '@prisma/client';

export interface PriceRange {
    minVariantPrice: {
        amount: string;
        currencyCode: string;
    };
}

export interface FeaturedImage {
    url: string;
    altText: string | null;
}

export interface SelectedOption {
    name: string;
    value: string;
}

export interface Variant {
    selectedOptions: SelectedOption[];
}

export interface ShopifyProduct {
    id: string;
    title: string;
    availableForSale: boolean;
    compareAtPriceRange: PriceRange;
    priceRange: PriceRange;
    featuredImage: FeaturedImage | null;
    productType: string;
    variants: {
        nodes: Variant[];
    };
}

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
    type?: string,
    sizes?: string[],
}

export interface Cart {
    checkoutUrl: string,
    id: string,
    lines: {
        edges: [
            {
                node: {
                    id: string,
                    merchandise: {
                        id: string
                        price: {
                            amount: string,
                            currencyCode: string
                        },
                        product: {
                            images: {
                                edges: [
                                    {
                                        node: {
                                            url: string,
                                        }
                                    }
                                ]
                            },
                            title: string,
                        },
                        title: string,
                    },
                    quantity: number;
                }
            }
        ]
    }
}