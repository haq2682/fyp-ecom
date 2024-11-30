"use client";
import { useEffect, useState, useCallback } from "react";
import { getCustomers } from "@/actions/customers";
import { Input } from "@/components/ui/input";
import { User } from "@prisma/client";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import Loading from '@/components/ui/loading';
import CustomersTable from "@/components/dashboard/customers/table";
// const sampleCustomers: Customer[] = [
//     { id: 1, username: 'john_doe', email: 'john@example.com', address: '123 Elm St' },
//     { id: 2, username: 'jane_smith', email: 'jane@example.com', address: '456 Oak St' },
//     { id: 3, username: 'alice_johnson', email: 'alice@example.com', address: '789 Pine St' },
//     { id: 4, username: 'bob_brown', email: 'bob@example.com', address: '101 Maple St' },
// ];
const Customers = () => {
    const [customers, setCustomers] = useState<User[]>([]);
    const [error, setError] = useState<unknown | null>();
    const fetchCustomers = useCallback(async () => {
        try {
            const response = await getCustomers();
            setCustomers(response);
        }
        catch (error) {
            setError(error);
        }
    }, [customers]);
    useEffect(() => {
        fetchCustomers();
    }, []);
    return (
        <div className="container mx-auto mt-12">
            <header className="flex justify-between items-center mb-4">
                <h2 className="text-3xl font-bold w-1/6">Customers</h2>
                <Input className="w-1/3 md:w-1/4 lg:w-1/6" placeholder="Search Customers" />
            </header>
            <CustomersTable customers={customers} setCustomers={setCustomers} />
            <div className="mt-12">
                <Pagination>
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious href="#" />
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationLink href="#">1</PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationLink href="#" isActive>
                                2
                            </PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationLink href="#">3</PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationEllipsis />
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationNext href="#" />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>
        </div >
    );
};
export default Customers;