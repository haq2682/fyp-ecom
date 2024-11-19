"use client";
import { ChevronDown } from "lucide-react"
import { IoClose } from "react-icons/io5";

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";
import { useTheme } from "next-themes";

export function AppSidebar() {
    const { toggleSidebar } = useSidebar();
    const { theme, setTheme } = useTheme();
    return (
        <Sidebar variant="inset">
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>
                        <div className="flex justify-between w-full">
                            <div>
                                <h1>
                                    E-Commerce
                                </h1>
                            </div>
                            <div onClick={toggleSidebar}>
                                <IoClose size={18} />
                            </div>
                        </div>
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild>
                                    <Link href="/home">
                                        <span>Home</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <Collapsible defaultOpen={false} className="group/collapsible">
                                    <CollapsibleTrigger className="flex px-2 my-2 justify-between w-full">
                                        <span className="text-md">Categories</span>
                                        <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                                    </CollapsibleTrigger>
                                    <CollapsibleContent className="ml-2">
                                        <SidebarMenuItem>
                                            <SidebarMenuButton>
                                                <Link href="#">
                                                    <span>T-Shirts</span>
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                        <SidebarMenuItem>
                                            <SidebarMenuButton>
                                                <Link href="#">
                                                    <span>Polos</span>
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                        <SidebarMenuItem>
                                            <SidebarMenuButton>
                                                <Link href="#">
                                                    <span>Jeans</span>
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                        <SidebarMenuItem>
                                            <SidebarMenuButton>
                                                <Link href="#">
                                                    <span>Trousers</span>
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    </CollapsibleContent>
                                </Collapsible>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild>
                                    <Link href="/about">
                                        <span>About</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild>
                                    <Link href="/contact">
                                        <span>Contact</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild>
                                    <Link href="/cart">
                                        <span>Cart</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild>
                                    <Link href="#">
                                        <span>Profile</span>
                                    </Link>
                                </SidebarMenuButton>
                                <SidebarMenuButton>
                                    <span onClick={() => setTheme(() => theme === 'light' ? 'dark' : 'light')}>Toggle Theme</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}
