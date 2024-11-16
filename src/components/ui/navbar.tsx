"use client"
import { Button } from '@/components/ui/button';
import { useSidebar } from '@/components/ui/sidebar';
import { TfiMenuAlt } from "react-icons/tfi";
export default function Navbar() {
    const { toggleSidebar } = useSidebar();
    return (
        <>
            <nav className="flex min-w-full h-12 items-center md:px-24 lg:px-36">
                <div onClick={toggleSidebar} className="md:hidden">
                    <Button className="bg-background text-foreground">
                        <TfiMenuAlt size={25} />
                    </Button>
                </div>
                <div className="flex justify-between w-full container mx-auto">
                    <div>
                        <h1>Company Name</h1>
                    </div>
                    <div>
                        <h1>Search Bar</h1>
                    </div>
                </div>
            </nav>
        </>
    )
}