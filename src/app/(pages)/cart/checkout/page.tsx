'use client'

import { useState } from 'react'
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

export default function Component() {
    const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery')

    return (
        <>
            <div className="mx-auto container mb-12">
                <div className="flex flex-col md:flex-row justify-between items-start mb-4 w-full">
                    <div className="w-full md:w-1/2 space-y-4">
                        <h1 className="text-2xl font-bold mb-12">Shipping Address</h1>
                        <div className="w-full md:w-[95%]">
                            <Input placeholder="Street Address" />
                        </div>
                        <div className="w-full md:w-[95%] flex gap-x-6">
                            <Input placeholder="City" className="w-1/2" />
                            <Input placeholder="State" className="w-1/2" />
                        </div>
                        <div className="w-full md:w-[95%] flex gap-x-6">
                            <Input placeholder="Zip Code" className="w-1/2" />
                            <Input placeholder="Country" className="w-1/2" />
                        </div>
                        <div className="w-full md:w-[95%] flex gap-x-6">
                            <Input placeholder="Email" className="w-1/2" />
                            <Input placeholder="Full Name" className="w-1/2" />
                        </div>
                    </div>
                    <div className="w-full md:w-1/2 space-y-4">
                        <h1 className="text-2xl font-bold mb-12">Payment Method</h1>
                        <div className="w-full">
                            <RadioGroup
                                defaultValue="Cash on Delivery"
                                className="flex justify-between w-2/4"
                                onValueChange={setPaymentMethod}
                            >
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="Credit Card" id="cc" />
                                    <Label htmlFor="cc">Credit Card</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="Cash on Delivery" id="cod" />
                                    <Label htmlFor="cod">Cash on Delivery</Label>
                                </div>
                            </RadioGroup>
                        </div>
                        {paymentMethod === 'Credit Card' && (
                            <div className="w-full md:2/3 space-y-4">
                                <div className="w-full">
                                    <Input placeholder="Card Holder Name" />
                                </div>
                                <div className="w-full">
                                    <Input placeholder="Card Number" />
                                </div>
                                <div className="w-full flex gap-x-6">
                                    <Input placeholder="Expiry Month" className="w-1/2" />
                                    <Input placeholder="Expiry Year" className="w-1/2" />
                                    <Input placeholder="CVV" className="w-1/2" />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <div className="border border-border p-4 w-full md:w-1/3 mt-12 space-y-3 float-right">
                    <div className="mb-8">
                        <h1 className="font-bold text-2xl">Your Order</h1>
                    </div>
                    <div className="flex justify-between">
                        <p>Subtotal</p>
                        <p className="font-bold">$100.00</p>
                    </div>
                    <div className="flex justify-between">
                        <p>Shipping</p>
                        <p className="font-bold">$5.00</p>
                    </div>
                    <div className="flex justify-between">
                        <p>GST</p>
                        <p className="font-bold">$2.75</p>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                        <p>Grand Total</p>
                        <p className="font-bold">$107.75</p>
                    </div>
                    <div className="flex justify-center">
                        <Button asChild className="mt-8 w-full rounded-sm" size="lg">
                            <Link href="/cart/checkout/orderplaced">
                                Place Order
                            </Link>
                        </Button>
                    </div>
                    <div className="flex justify-center">
                        <Button variant="ghost" asChild className="mt-4 w-full">
                            <Link href="/cart">
                                Edit Cart
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </>
    )
}