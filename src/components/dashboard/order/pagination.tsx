"use client"

import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

export default function OrdersPagination({ totalPages, currentPage, setIsLoading }: { totalPages: number, currentPage: number, setIsLoading: (value: boolean) => void }) {
    const searchParams = useSearchParams()
    const pathname = usePathname()
    const { replace } = useRouter()

    const handlePageChange = (page: number) => {
        setIsLoading(true)
        const params = new URLSearchParams(searchParams)
        params.set('page', page.toString())
        replace(`${pathname}?${params.toString()}`)
    }

    return (
        <>
            <Pagination>
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious
                            onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                            className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                        />
                    </PaginationItem>

                    
                    <PaginationItem>
                        <PaginationLink
                            onClick={() => handlePageChange(1)}
                            isActive={currentPage === 1}
                            className='cursor-pointer'
                        >
                            1
                        </PaginationLink>
                    </PaginationItem>

                    
                    {currentPage > 3 && (
                        <PaginationItem>
                            <PaginationEllipsis />
                        </PaginationItem>
                    )}

                    
                    {currentPage > 2 && currentPage < totalPages && (
                        <PaginationItem>
                            <PaginationLink
                                onClick={() => handlePageChange(currentPage - 1)}
                                className="cursor-pointer"
                            >
                                {currentPage - 1}
                            </PaginationLink>
                        </PaginationItem>
                    )}

                    
                    {currentPage !== 1 && currentPage !== totalPages && (
                        <PaginationItem>
                            <PaginationLink
                                isActive
                                className="cursor-pointer"
                            >
                                {currentPage}
                            </PaginationLink>
                        </PaginationItem>
                    )}

                    
                    {currentPage < totalPages - 1 && currentPage > 1 && (
                        <PaginationItem>
                            <PaginationLink
                                onClick={() => handlePageChange(currentPage + 1)}
                                className="cursor-pointer"
                            >
                                {currentPage + 1}
                            </PaginationLink>
                        </PaginationItem>
                    )}

                    
                    {currentPage < totalPages - 2 && (
                        <PaginationItem>
                            <PaginationEllipsis />
                        </PaginationItem>
                    )}

                    
                    {totalPages > 1 && (
                        <PaginationItem>
                            <PaginationLink
                                onClick={() => handlePageChange(totalPages)}
                                isActive={currentPage === totalPages}
                                className="cursor-pointer"
                            >
                                {totalPages}
                            </PaginationLink>
                        </PaginationItem>
                    )}

                    <PaginationItem>
                        <PaginationNext
                            onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                            className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                        />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </>
    )
}
