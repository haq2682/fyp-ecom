"use client";
import { Button } from '@/components/ui/button';
import { useSidebar } from './sidebar';
import { Menu, ChevronRight, Home } from 'lucide-react';
import Link from "next/link";
import { useTheme } from 'next-themes';
import { FaRegMoon, FaRegSun } from 'react-icons/fa';
export default function DashboardNavbar() {
    const { toggleSidebar } = useSidebar();
    const { theme, setTheme } = useTheme();
    return (
        <>
            <header className="border-b">
                <div className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" onClick={toggleSidebar} className="lg:hidden">
                            <Menu className="h-6 w-6" />
                        </Button>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>Admin</span>
                            <ChevronRight className="h-4 w-4" />
                            <span>Dashboard</span>
                        </div>
                    </div>
                    <div className="gap-x-2 flex">
                        <div className="text-center">
                            <Button variant="ghost" asChild>
                                <Link href="/home">
                                    <Home />
                                </Link>
                            </Button>
                        </div>
                        <div className="text-center">
                            {
                                theme === 'light' && <Button variant="ghost" onClick={() => setTheme('dark')}><FaRegMoon /></Button>
                            }
                            {
                                theme === 'dark' && <Button variant="ghost" onClick={() => setTheme('light')}><FaRegSun /></Button>
                            }
                        </div>
                    </div>
                </div>
            </header >
        </>
    )
}