"use client"
import { useEffect, useState } from "react"
import { ChevronDown } from "lucide-react"
import { IoClose } from "react-icons/io5"
import { useRouter } from "next/navigation"
import { ClipLoader} from "react-spinners"

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
import Link from "next/link"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible"
import { useTheme } from "next-themes"
import { getProductTypes } from "@/actions/products"
import {useSession} from 'next-auth/react';

export function AppSidebar() {
  const { toggleSidebar } = useSidebar()
  const { theme, setTheme } = useTheme()
  const [productTypes, setProductTypes] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const {status} = useSession();

  useEffect(() => {
    const fetchProductTypes = async () => {
      try {
        const types = await getProductTypes()
        setProductTypes(Array.from(types as Set<string>))
      } catch (error) {
        console.error("Error fetching product types:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProductTypes()
  }, [])

  const handleProductTypeClick = (type: string) => {
    router.push(`/search?type=${encodeURIComponent(type)}`)
    toggleSidebar()
  }

  return (
    <Sidebar variant="inset">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            <div className="flex justify-between w-full">
              <div>
                <h1>E-Commerce</h1>
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
                    {isLoading ? (
                      <SidebarMenuItem>
                        <SidebarMenuButton>
                          <div className="p-4 flex justify-center items-center">
                            <ClipLoader color="#000" size={24} />
                          </div>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ) : (
                      productTypes.map((type, index) => (
                        <SidebarMenuItem key={index}>
                          <SidebarMenuButton onClick={() => handleProductTypeClick(type)}>
                            <span>{type}</span>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))
                    )}
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
              {
                status !== 'authenticated' && 
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link href="/account/login">
                      <span>Log In</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              }
              <SidebarMenuItem>
                {
                  status !== 'authenticated' &&
                  <SidebarMenuButton asChild>
                    <Link href="/profile">
                      <span>Profile</span>
                    </Link>
                  </SidebarMenuButton>
                }
                <SidebarMenuButton>
                  <span onClick={() => setTheme(() => (theme === "light" ? "dark" : "light"))}>Toggle Theme</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
