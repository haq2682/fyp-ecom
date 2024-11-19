"use client";
import { LayoutDashboard, Package, Settings, ShoppingCart, X } from "lucide-react"

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Separator } from "./ui/separator";
export default function DashboardSidebar() {
    const pathname = usePathname();
    const { toggleSidebar } = useSidebar();
    return (
        <Sidebar variant="inset">
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>
                        <div className="w-full flex justify-between items-center">
                            <h1 className="text-xl font-bold flex items-center gap-2">
                                <Package className="h-6 w-6" />
                                Admin
                            </h1>
                            <Button variant="ghost" size="icon" onClick={toggleSidebar} className="lg:hidden">
                                <X className="h-6 w-6" />
                            </Button>
                        </div>
                    </SidebarGroupLabel>
                    <Separator className="my-2 mb-4" />
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <Link
                                    href="/dashboard"
                                    className={`flex items-center gap-3 px-3 py-2 text-sm rounded-lg hover:bg-secondary ${pathname === '/dashboard' ? 'bg-secondary' : ''}`}
                                >
                                    <LayoutDashboard className="h-4 w-4" />
                                    Dashboard
                                </Link>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <Link
                                    href="/dashboard/products"
                                    className={`flex items-center gap-3 px-3 py-2 text-sm rounded-lg hover:bg-secondary ${pathname === '/dashboard/products' ? 'bg-secondary' : ''}`}
                                >
                                    <Package className="h-4 w-4" />
                                    Products
                                </Link>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <Link
                                    href="/dashboard/orders"
                                    className={`flex items-center gap-3 px-3 py-2 text-sm rounded-lg hover:bg-secondary ${pathname === '/dashboard/orders' ? 'bg-secondary' : ''}`}
                                >
                                    <ShoppingCart className="h-4 w-4" />
                                    Orders
                                </Link>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <Link
                                    href="/dashboard/settings"
                                    className={`flex items-center gap-3 px-3 py-2 text-sm rounded-lg hover:bg-secondary ${pathname === '/dashboard/settings' ? 'bg-secondary' : ''}`}
                                >
                                    <Settings className="h-4 w-4" />
                                    Settings
                                </Link>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}