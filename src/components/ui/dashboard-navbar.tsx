"use client";
import { Button } from '@/components/ui/button';
import { useSidebar } from './sidebar';
import { Menu, ChevronRight } from 'lucide-react';
export default function DashboardNavbar() {
    const { toggleSidebar } = useSidebar();
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
                </div>
            </header>
        </>
    )
}