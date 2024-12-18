'use client'

import { useState } from "react"
import Image from "next/image"
import { Minus, Plus } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import Link from "next/link"

export default function Component() {
    const [quantity, setQuantity] = useState(1)
    const [selectedSize, setSelectedSize] = useState("S")

    return (
        <>
            <div className="container mx-auto px-4 py-8">
                <div className="text-sm breadcrumbs mb-8">
                    <Link href="/" className="text-muted-foreground hover:text-primary">
                        Ecommerce
                    </Link>
                    <span className="mx-2 text-muted-foreground">/</span>
                    <span>Raw Black T-Shirt</span>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    <div className="relative">
                        <Image
                            src="https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1695457335_2236257.jpg?v=2"
                            alt="Black T-shirt with small circular logo"
                            width={600}
                            height={600}
                            className="w-full rounded-lg"
                            priority
                        />
                    </div>

                    <div className="space-y-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <h1 className="text-2xl font-bold mb-2">Raw Black T-Shirt Lineup</h1>
                                <div className="flex items-center space-x-2">

                                    <div className="text-sm p-1.5 border border-border text-center bg-background rounded-lg text-green-500">IN STOCK</div>
                                </div>
                            </div>
                        </div>
                        <div className="text-2xl font-bold">$75.00</div>
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-sm font-medium mb-3">SELECT SIZE</h3>
                                <RadioGroup
                                    defaultValue={selectedSize}
                                    onValueChange={setSelectedSize}
                                    className="flex flex-wrap gap-2"
                                >
                                    {["S", "M", "X", "XL", "XXL"].map((size) => (
                                        <div key={size}>
                                            <RadioGroupItem value={size} id={`size-${size}`} className="sr-only" />
                                            <Label
                                                htmlFor={`size-${size}`}
                                                className={`px-4 py-2 border rounded cursor-pointer ${selectedSize === size
                                                    ? "border-primary bg-primary/10"
                                                    : "border-input hover:bg-accent"
                                                    }`}
                                            >
                                                {size}
                                            </Label>
                                        </div>
                                    ))}
                                </RadioGroup>
                            </div>

                            <div>
                                <h3 className="text-sm font-medium mb-3">QUANTITY</h3>
                                <div className="flex items-center space-x-4">
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    >
                                        <Minus className="w-4 h-4" />
                                    </Button>
                                    <span className="text-lg font-medium w-12 text-center">{quantity}</span>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => setQuantity(quantity + 1)}
                                    >
                                        <Plus className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <div className="flex space-x-4">
                            <Button className="flex-1 text-lg py-6 hover:opacity-70">Add to cart</Button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

