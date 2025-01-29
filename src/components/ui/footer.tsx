"use client"
import { SiVisa } from "react-icons/si";
import { SiMastercard } from "react-icons/si";
import { GrAmex } from "react-icons/gr";
import Link from "next/link";
export default function Footer() {
    return (
        <>
            <footer className="bg-secondary">
                <div className="flex flex-col w-full lg:flex-row justify-evenly py-8 space-x-8 space-y-12 overflow-x-auto">
                    <div className="text-center flex items-center flex-col pl-4 justify-center">
                        <h2 className="text-2xl font-bold">E-COMMERCE</h2>
                        <p className="w-56">A sample e-commerce web application in NextJS for Practice Purposes</p>
                    </div>
                    <div className="flex justify-center text-center flex-col sm:flex-row sm:space-x-8">
                        <div className="space-y-1 mb-8 flex flex-col">
                            <h2 className="text-lg font-bold text-neutral-500 mb-5">FAQ</h2>
                            <Link href="/terms" className="hover:underline">Terms of Use</Link>
                            <Link href="/privacy" className="hover:underline">Privacy Policy</Link>
                        </div>
                        <div className="space-y-1 mb-8 flex flex-col">
                            <h2 className="text-lg font-bold text-neutral-500 mb-5">COMPANY</h2>
                            <Link href="/about" className="hover:underline">About Us</Link>
                            <Link href="/contact" className="hover:underline">Contact Us</Link>
                        </div>
                        <div className="space-y-1 mb-8 flex flex-col">
                            <h2 className="text-lg font-bold text-neutral-500 mb-5">SHOP</h2>
                            <Link href="/profile" className="hover:underline">My Account</Link>
                            <Link href="/cart/checkout" className="hover:underline">Checkout</Link>
                            <Link href="/cart" className="hover:underline">Cart</Link>
                        </div>
                    </div>
                    <div className="text-center">
                        <h2 className="text-2xl font-bold">ACCEPTED PAYMENTS</h2>
                        <div className="flex space-x-4 flex-wrap justify-center">
                            <div>
                                <SiVisa size={40} />
                            </div>
                            <div>
                                <SiMastercard size={40} />
                            </div>
                            <div>
                                <GrAmex size={40} />
                            </div>

                        </div>
                    </div>
                </div>
                <div className="text-center text-zinc-400 dark:text-zinc-600">
                    2024 FA22-BCS-B-Prac-ECom. All Rights Reserved
                </div>
            </footer>
        </>
    );
}