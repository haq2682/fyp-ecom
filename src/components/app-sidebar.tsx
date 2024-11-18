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
} from "@/components/ui/sidebar"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";

export function AppSidebar() {
    const { toggleSidebar } = useSidebar();
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
                                    <a href="#">
                                        <span>Home</span>
                                    </a>
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
                                                <a href="#">
                                                    <span>T-Shirts</span>
                                                </a>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                        <SidebarMenuItem>
                                            <SidebarMenuButton>
                                                <a href="#">
                                                    <span>Polos</span>
                                                </a>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                        <SidebarMenuItem>
                                            <SidebarMenuButton>
                                                <a href="#">
                                                    <span>Jeans</span>
                                                </a>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                        <SidebarMenuItem>
                                            <SidebarMenuButton>
                                                <a href="#">
                                                    <span>Trousers</span>
                                                </a>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    </CollapsibleContent>
                                </Collapsible>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild>
                                    <a href="/about">
                                        <span>About</span>
                                    </a>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild>
                                    <a href="/contact">
                                        <span>Contact</span>
                                    </a>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild>
                                    <a href="/cart">
                                        <span>Cart</span>
                                    </a>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild>
                                    <a href="#">
                                        <span>Profile</span>
                                    </a>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}
