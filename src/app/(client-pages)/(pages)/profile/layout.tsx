"use client";
import Link from "next/link";
import { User, Truck, Key, Package } from "lucide-react"; import { usePathname } from "next/navigation";
import {useSession} from 'next-auth/react';
import {redirect} from 'next/navigation';
export default function ProfileLayout({ children }: { children: Readonly<React.ReactNode> }) {
    const {status} = useSession();
    if(status !== 'authenticated') redirect('/');
    const pathname = usePathname();
    return (
        <>
            <div className="container mx-auto my-12">
                <div className="flex min-h-[400px]">
                    <div className="border-r border-r-black flex flex-col justify-center md:w-1/4 gap-y-4">
                        <Link href="/profile" className={`cursor-pointer p-3 px-6 mr-8 rounded-sm transition-color duration-200 hover:bg-neutral-200 dark:hover:bg-neutral-800 flex ${pathname === '/profile' && 'bg-secondary'}`}>
                            <User className="mr-2" />Profile
                        </Link>
                        <Link href="/profile/address" className={`cursor-pointer p-3 px-6 mr-8 rounded-sm transition-color duration-200 hover:bg-neutral-200 dark:hover:bg-neutral-800 flex ${pathname === '/profile/address' && 'bg-secondary'}`}>
                            <Truck className="mr-2" />Address
                        </Link>
                        <Link href="/profile/password" className={`cursor-pointer p-3 px-6 mr-8 rounded-sm transition-color duration-200 hover:bg-neutral-200 dark:hover:bg-neutral-800 flex ${pathname === '/profile/password' && 'bg-secondary'}`}>
                            <Key className="mr-2" />Password
                        </Link>
                        <Link href="/profile/orders" className={`cursor-pointer p-3 px-6 mr-8 rounded-sm transition-color duration-200 hover:bg-neutral-200 dark:hover:bg-neutral-800 flex ${pathname === '/profile/orders' && 'bg-secondary'}`}>
                            <Package className="mr-2" />Orders
                        </Link>
                    </div>
                    <div className="w-9/12 mx-auto">
                        {children}
                    </div>
                </div>
            </div>
        </>
    )
}