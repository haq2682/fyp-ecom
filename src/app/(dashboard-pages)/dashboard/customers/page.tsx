"use client";
import { useEffect, useState, useCallback } from "react";
import { getCustomers } from "@/actions/customers";
import { User } from "@prisma/client";
import CustomersTable from "@/components/dashboard/customers/table";
import CustomersSearch from "@/components/dashboard/customers/search";
import CustomersPagination from "@/components/dashboard/customers/pagination";
import { useSearchParams } from "next/navigation";
import Loading from "@/components/ui/loading";

export default function Customers() {
    const searchParams = useSearchParams();
    const searchQuery: string | null = searchParams.get('query');
    const currentPage: number = Number(searchParams.get('page')) || 1;
    const [customers, setCustomers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [totalPages, setTotalPages] = useState<number>(1);

    const fetchCustomers = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        setCustomers([]);
        try {
            const response = await getCustomers(searchQuery, currentPage);
            setCustomers(response.result);
            setTotalPages(response.totalPages);
        } catch (error) {
            console.error(error);
            setError('Failed to fetch customers. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    }, [searchQuery, currentPage, totalPages]);

    useEffect(() => {
        fetchCustomers();
    }, [fetchCustomers]);

    return (
        <div className="container mx-auto mt-12">
            <header className="flex justify-between items-center mb-4">
                <h2 className="text-3xl font-bold w-1/6">Customers</h2>
                <CustomersSearch />
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
                <CustomersPagination totalPages={totalPages} currentPage={currentPage} setIsLoading={setIsLoading} />
            </div>
        </div>
    );
}

;