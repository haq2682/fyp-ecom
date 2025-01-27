"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { useSidebar } from "@/components/ui/sidebar"
import { TfiMenuAlt } from "react-icons/tfi"
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu"
import { IoCartOutline } from "react-icons/io5"
import { CgProfile } from "react-icons/cg"
import { FaRegMoon, FaRegSun } from "react-icons/fa"
import Link from "next/link"
import { useTheme } from "next-themes"
import { useSession } from "next-auth/react"
import { BiLogInCircle } from "react-icons/bi"
import { getProductTypes } from "@/actions/products"
import SearchBar from "@/components/searchbar"

export default function Navbar() {
  const { theme, setTheme } = useTheme()
  const { toggleSidebar } = useSidebar()
  const { status } = useSession()
  const [productTypes, setProductTypes] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchProductTypes = async () => {
      try {
        setIsLoading(true)
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

  return (
    <>
      <nav className="flex min-w-full py-3 items-center md:px-24 lg:px-36 mx-auto container">
        <div onClick={toggleSidebar} className="lg:hidden">
          <Button className="bg-background text-foreground">
            <TfiMenuAlt size={25} />
          </Button>
        </div>
        <div className="flex items-center justify-between w-full container mx-auto">
          <div className="cursor-pointer">
            <Link href="/home" className="font-bold text-xl">
              E-Com
            </Link>
          </div>
          <div className="hidden lg:block">
            <NavigationMenu>
              <NavigationMenuList className="space-x-12">
                <NavigationMenuLink href="/home" className="hover:bg-secondary p-3 rounded-lg">
                  Home
                </NavigationMenuLink>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-md">Categories</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                      {isLoading ? (
                        <li className="col-span-2">Loading categories...</li>
                      ) : (
                        productTypes.map((type, index) => (
                          <NavigationMenuLink key={index} asChild>
                            <Link
                              className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                              href={`/search?type=${encodeURIComponent(type)}`}
                            >
                              <div className="text-sm font-medium leading-none">{type}</div>
                            </Link>
                          </NavigationMenuLink>
                        ))
                      )}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuLink href="/about" className="hover:bg-secondary p-3 rounded-lg">
                  About
                </NavigationMenuLink>
                <NavigationMenuLink href="/contact" className="hover:bg-secondary p-3 rounded-lg">
                  Contact
                </NavigationMenuLink>
                {status === "authenticated" && (
                  <NavigationMenuLink href="/admin" className="hover:bg-secondary p-3 rounded-lg">
                    Admin
                  </NavigationMenuLink>
                )}
              </NavigationMenuList>
            </NavigationMenu>
          </div>
          <div className="flex items-center">
            <div className="w-[40vw] lg:w-[20vw] mr-4">
              <SearchBar /> 
            </div>
            <div className="hidden lg:flex items-center">
              {status === "authenticated" ? (
                <>
                  <Link
                    href="/cart"
                    className="mr-3 ml-6 px-4 py-2 bg-background text-foreground hover:bg-secondary transition-colors duration-200 rounded-lg"
                  >
                    <IoCartOutline size={27} />
                  </Link>
                  <Link
                    className="ml-3 bg-background px-4 py-2 rounded-lg transition-colors duration-200 text-foreground hover:bg-secondary"
                    href="/profile"
                  >
                    <CgProfile size={27} />
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/auth"
                    className="mr-3 ml-6 px-4 py-2 bg-background text-foreground hover:bg-secondary transition-colors duration-200 rounded-lg"
                  >
                    <BiLogInCircle size={27} />
                  </Link>
                </>
              )}
              <div className="text-center ml-6">
                {theme === "light" && (
                  <Button variant="ghost" onClick={() => setTheme("dark")}>
                    <FaRegMoon />
                  </Button>
                )}
                {theme === "dark" && (
                  <Button variant="ghost" onClick={() => setTheme("light")}>
                    <FaRegSun />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  )
}

