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