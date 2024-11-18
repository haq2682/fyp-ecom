"use client";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbPage, BreadcrumbLink, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { ChevronRight } from "lucide-react";
import { usePathname } from "next/navigation";
import React from "react"
export default function PagesLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    const pathname = usePathname();
    const generateBreadcrumbs = () => {
        const paths = pathname.split('/').filter(path => path)
        const breadcrumbs = [
            {
                label: 'Home',
                href: '/',
            }
        ]

        let currentPath = ''
        paths.forEach((path) => {
            currentPath += `/${path}`
            breadcrumbs.push({
                label: path.charAt(0).toUpperCase() + path.slice(1),
                href: currentPath,
            })
        })

        return breadcrumbs
    }

    const breadcrumbs = generateBreadcrumbs()
    return (
        <>
            <Breadcrumb className="bg-secondary mb-12">
                <BreadcrumbList className="mx-auto container p-12">
                    {breadcrumbs.map((breadcrumb, index) => (
                        <BreadcrumbItem key={breadcrumb.href}>
                            {index < breadcrumbs.length - 1 ? (
                                <>
                                    <BreadcrumbLink href={breadcrumb.href} className="flex items-center text-lg font-semibold">
                                        {breadcrumb.label}
                                    </BreadcrumbLink>
                                    <BreadcrumbSeparator>
                                        <ChevronRight className="h-4 w-4" />
                                    </BreadcrumbSeparator>
                                </>
                            ) : (
                                <BreadcrumbPage className="text-lg font-semibold">{breadcrumb.label}</BreadcrumbPage>
                            )}
                        </BreadcrumbItem>
                    ))}
                </BreadcrumbList>
            </Breadcrumb>
            {children}
        </>
    )
}