"use client"
import { Button } from '@/components/ui/button';
import { useSidebar } from '@/components/ui/sidebar';
import { TfiMenuAlt } from "react-icons/tfi";
import { Input } from "@/components/ui/input";
import { LuSearch } from "react-icons/lu";
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuTrigger, NavigationMenuContent, NavigationMenuLink } from "@/components/ui/navigation-menu";
import { IoCartOutline } from "react-icons/io5";
import { CgProfile } from "react-icons/cg";
import { FaRegMoon, FaRegSun } from "react-icons/fa";
import Link from 'next/link';
import { useTheme } from 'next-themes';
export default function Navbar() {
    const { theme, setTheme } = useTheme();
    const { toggleSidebar } = useSidebar();
    return (
        <>
            <nav className="flex min-w-full py-3 items-center md:px-24 lg:px-36">
                <div onClick={toggleSidebar} className="lg:hidden">
                    <Button className="bg-background text-foreground">
                        <TfiMenuAlt size={25} />
                    </Button>
                </div>
                <div className="flex items-center justify-between w-full container mx-auto">
                    <div className="text-center">
                        {
                            theme === 'light' && <Button onClick={() => setTheme('dark')}><FaRegMoon /></Button>
                        }
                        {
                            theme === 'dark' && <Button onClick={() => setTheme('light')}><FaRegSun /></Button>
                        }
                    </div>
                    <div className="cursor-pointer">
                        <Link href="/home" className="font-bold text-xl">E-Com</Link>
                    </div>
                    <div className="hidden lg:block">
                        <NavigationMenu>
                            <NavigationMenuList className="space-x-12">
                                <NavigationMenuLink href="#" className="hover:bg-secondary p-3 rounded-lg">
                                    Home
                                </NavigationMenuLink>
                                <NavigationMenuItem>
                                    <NavigationMenuTrigger className="text-md">Categories</NavigationMenuTrigger>
                                    <NavigationMenuContent>
                                        <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                                            <li>
                                                <NavigationMenuLink asChild>
                                                    <a className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground" href="#">
                                                        <div className="text-sm font-medium leading-none">T-Shirts</div>
                                                    </a>
                                                </NavigationMenuLink>
                                            </li>
                                            <li>
                                                <NavigationMenuLink asChild>
                                                    <a className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground" href="#">
                                                        <div className="text-sm font-medium leading-none">Polos</div>
                                                    </a>
                                                </NavigationMenuLink>
                                            </li>
                                            <NavigationMenuLink asChild>
                                                <a className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground" href="#">
                                                    <div className="text-sm font-medium leading-none">Jeans</div>
                                                </a>
                                            </NavigationMenuLink>
                                            <NavigationMenuLink asChild>
                                                <a className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground" href="#">
                                                    <div className="text-sm font-medium leading-none">Trousers</div>
                                                </a>
                                            </NavigationMenuLink>
                                        </ul>
                                    </NavigationMenuContent>
                                </NavigationMenuItem>
                                <NavigationMenuLink href="#" className="hover:bg-secondary p-3 rounded-lg">
                                    About
                                </NavigationMenuLink>
                                <NavigationMenuLink href="#" className="hover:bg-secondary p-3 rounded-lg">
                                    Contact
                                </NavigationMenuLink>
                            </NavigationMenuList>
                        </NavigationMenu>
                    </div>
                    <div className="flex">
                        <div className="relative">
                            <LuSearch className="absolute top-1/2 -translate-y-1/2 left-2 text-primary" />
                            <Input className="pl-8 w-[40vw] lg:w-[20vw]" placeholder="Search..." type="text" />
                        </div>
                        <div className="hidden lg:flex items-center">
                            <Link href="#" className="mr-3 ml-6 px-4 py-2 bg-background text-foreground hover:bg-secondary transition-colors duration-200 rounded-lg" >
                                <IoCartOutline size={27} />
                            </Link>
                            <Link className="ml-3 bg-background px-4 py-2 rounded-lg transition-colors duration-200 text-foreground hover:bg-secondary" href="#" >
                                <CgProfile size={27} />
                            </Link>
                        </div>
                    </div>
                </div>
            </nav >
        </>
    )
}