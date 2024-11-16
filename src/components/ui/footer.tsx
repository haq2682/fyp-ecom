"use client"
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
export default function Footer() {
    const { theme, setTheme } = useTheme();
    return (
        <>
            <div className="bg-secondary">
                <div className="flex flex-col w-full lg:flex-row justify-evenly py-8 space-x-8 space-y-12 overflow-x-auto">
                    <div className="text-center flex items-center flex-col justify-center">
                        <h2 className="text-2xl font-bold">E-Commerce</h2>
                        <p className="w-56">A sample e-commerce web application in NextJS for Practice Purposes</p>
                    </div>
                    <div className="flex justify-center text-center flex-col sm:flex-row">
                        <div>
                            <h2 className="text-2xl font-bold">FAQ</h2>
                            <p>Terms of Use</p>
                            <p>Privacy Policy</p>
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold">COMPANY</h2>
                            <p>About Us</p>
                            <p>Contact Us</p>
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold">SHOP</h2>
                            <p>My Account</p>
                            <p>Checkout</p>
                            <p>Cart</p>
                        </div>
                    </div>
                    <div className="text-center">
                        <h2 className="text-2xl font-bold">ACCEPTED PAYMENTS</h2>
                        <div className="flex space-x-4 flex-wrap justify-center">
                            <div>
                                Visa
                            </div>
                            <div>
                                Mastercard
                            </div>
                            <div>
                                Amex
                            </div>
                            <div className="text-center">
                                {
                                    theme === 'light' && <Button onClick={() => setTheme('dark')}>Switch to Dark</Button>
                                }
                                {
                                    theme === 'dark' && <Button onClick={() => setTheme('light')}>Switch to Light</Button>
                                }
                            </div>
                        </div>
                    </div>
                </div>
                <div className="text-center">
                    2024 FA22-BCS-B-Prac-ECom. All Rights Reserved
                </div>
            </div>
        </>
    );
}