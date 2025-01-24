"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "@/components/theme-provider";
import { CartProvider } from "@/contexts/cart";
import React from "react";

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <ThemeProvider
                attribute="class"
                defaultTheme="light"
                enableSystem
                disableTransitionOnChange
            >
                <CartProvider>
                    {children}
                </CartProvider>
            </ThemeProvider>
        </SessionProvider>
    )
}