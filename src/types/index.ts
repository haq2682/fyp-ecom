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
    featuredImage: {
        altText: string,
        url: string,
    },
    image: string
}

export interface Order {
    id: string;
    orderNumber: number;
    createdAt: Date;
    totalAmount: number;
    totalPrice: Money;
    name: string;
    processedAt: string;
    financialStatus: string;
    lineItems: {
        edges: Array<{
            node: LineItem;
        }>;
    };
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

export interface LoginFormState {
    status: string;
    message: string;
    redirectUrl?: string;
    errors?: {
        email?: string[];
        password?: string[];
    };
}

export type LoginAction = (formData: FormData) => Promise<LoginFormState>;

export interface Money {
    amount: string;
    currencyCode: string;
}

export interface Image {
    transformedSrc: string;
    altText: string | null;
}

export interface OrderProduct {
    createdAt: string;
    featuredImage: {
        url: string;
        altText: string | null;
    };
}

export interface Variant {
    compareAtPrice: Money | null;
    price: Money;
    title: string;
    unitPrice: Money | null;
    image: Image | null;
    product: Product;
    id: string;
}

export interface LineItem {
    variant: Variant;
    quantity: number;
}

export interface ProfileOrder {
    totalPrice: Money;
    orderNumber: number;
    name: string;
    id: string;
    processedAt: string;
    financialStatus: string;
    lineItems: {
        edges: Array<{
            node: LineItem;
        }>;
    };
}

export interface OrdersResponse {
    customer: {
        orders: {
            edges: Array<{
                node: Order;
            }>;
            pageInfo: {
                endCursor: string;
                hasNextPage: boolean;
                hasPreviousPage: boolean;
                startCursor: string;
            };
            totalCount: number;
        };
    };
}

export interface CustomerUserError {
    code: string;
    field: string[];
    message: string;
}

export interface CustomerAccessToken {
    accessToken: string;
    expiresAt: string;
}

export interface CustomerUpdateResponse {
    customer: {
        firstName: string;
        lastName: string;
        email: string;
    };
    customerAccessToken?: CustomerAccessToken;
    customerUserErrors: CustomerUserError[];
}

// Update the existing ProfileResponse interface if needed
export interface ProfileResponse {
    success: boolean;
    message: string;
    user?: ProfileUpdateData;
}

export interface ProfileUpdateData {
    firstName: string;
    lastName: string;
    email: string;
}
export interface PasswordUpdateData {
    currentPassword: string;
    newPassword: string;
}

export interface PasswordUpdateResponse {
    success: boolean;
    message: string;
    errors?: Array<{
        code: string;
        message: string;
    }>;
}

export interface AddressData {
    address1: string;
    city: string;
    province: string;
    zip: string;
    country: string;
}

export interface AddressResponse {
    success: boolean;
    message: string;
    address?: AddressData;
    errors?: Array<{
        code: string;
        message: string;
        field?: string[];
    }>;
}

export interface CustomerAddress {
    id: string;
    address1: string;
    city: string;
    province: string;
    zip: string;
    country: string;
    isDefaultAddress?: boolean;
}