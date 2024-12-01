"use client";
import { useEffect, useState, useCallback } from "react";
import { getCustomers } from "@/actions/customers";
import { User } from "@prisma/client";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import CustomersTable from "@/components/dashboard/customers/table";
import CustomerSearch from "@/components/dashboard/customers/search";
import { useSearchParams } from "next/navigation";
import Loading from "@/components/ui/loading";

export default function Customers() {
    const searchParams = useSearchParams();
    const searchQuery = searchParams.get('query');
    const [customers, setCustomers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchCustomers = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        setCustomers([]);
        try {
            const response = await getCustomers(searchQuery);
            setCustomers(response);
        } catch (error) {
            setError('Failed to fetch customers. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    }, [searchQuery]);

    useEffect(() => {
        fetchCustomers();
    }, [fetchCustomers]);

    return (
        <div className="container mx-auto mt-12">
            <header className="flex justify-between items-center mb-4">
                <h2 className="text-3xl font-bold w-1/6">Customers</h2>
                <CustomerSearch />
            </header>
            <div className="flex justify-center items-center">
                {
                    isLoading && <Loading />
                }
                {
                    error && <p className="text-red-500">{error}</p>
                }
                {
                    !isLoading && !error && <CustomersTable customers={customers} setCustomers={setCustomers} />
                }
            </div>
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
        </div>
    );
}

;