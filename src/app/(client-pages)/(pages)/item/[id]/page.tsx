'use client'

import { useState, useEffect } from "react"
import { use } from "react"
import Image from "next/image"
import { Minus, Plus } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { getIndividualProduct } from "@/actions/products"
import Link from "next/link"
import { useCart } from '@/contexts/cart';
import { addToCart } from '@/actions/cart';
import { toast } from 'sonner';

export default function Component({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const [loading, setLoading] = useState<boolean>(false);
    const [quantity, setQuantity] = useState(1)
    const [selectedVariant, setSelectedVariant] = useState<any>(null);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [error, setError] = useState<string>('');
    const [product, setProduct] = useState<any>(null);
    const { cartId, refetchCart } = useCart();
    const [isAddingToCart, setIsAddingToCart] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            setError('');
            try {
                const response = await getIndividualProduct(resolvedParams.id);
                setProduct(response.data);
                // Set first variant as default
                if (response.data.variants.length > 0) {
                    setSelectedVariant(response.data.variants[0]);
                }
            }
            catch (error) {
                console.error(error);
                setError('Failed to fetch product');
            }
            finally {
                setLoading(false);
            }
        }
        fetchProduct();
    }, [resolvedParams.id]);

    const handleAddToCart = async () => {
        if (!cartId || !selectedVariant) return;

        setIsAddingToCart(true);
        try {
            await addToCart(cartId, selectedVariant.id, quantity);
            await refetchCart();
            toast.success('Added to cart successfully');
        } catch (error) {
            toast.error('Failed to add to cart');
        } finally {
            setIsAddingToCart(false);
        }
    };

    const handleVariantChange = (size: string) => {
        const variant = product.variants.find((v: any) => v.size === size);
        if (variant) {
            setSelectedVariant(variant);
        }
    };

    if (loading) {
        return <div className="text-center font-bold text-xl">Loading...</div>
    }
    else if (error) {
        return <div className="text-center text-red-500 font-bold text-xl">{error}</div>
    }
    else if (!product || !selectedVariant) {
        return <div className="text-center font-bold text-xl">No product found</div>
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="text-sm breadcrumbs mb-8">
                <Link href="/" className="text-muted-foreground hover:text-primary">
                    E-Commerce
                </Link>
                <span className="mx-2 text-muted-foreground">/</span>
                <span>{product.title}</span>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                    <div className="relative aspect-square">
                        <Image
                            src={product.images[selectedImageIndex].src}
                            alt={product.images[selectedImageIndex].alt}
                            fill
                            className="object-cover rounded-lg"
                            priority
                        />
                    </div>

                    <div className="grid grid-cols-4 gap-2">
                        {product.images.map((image: any, index: number) => (
                            <button
                                key={index}
                                onClick={() => setSelectedImageIndex(index)}
                                className={`relative aspect-square ${selectedImageIndex === index ? 'ring-2 ring-primary' : ''
                                    }`}
                            >
                                <Image
                                    src={image.src}
                                    alt={image.alt}
                                    fill
                                    className="object-cover rounded-md"
                                />
                            </button>
                        ))}
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-2xl font-bold mb-2">{product.title}</h1>
                            <div className="flex items-center space-x-2">
                                {selectedVariant.inStock ? (
                                    <div className="text-sm p-1.5 border border-border text-center bg-background rounded-lg text-green-500">
                                        IN STOCK
                                    </div>
                                ) : (
                                    <div className="text-sm p-1.5 border border-border text-center bg-background rounded-lg text-red-500">
                                        OUT OF STOCK
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {selectedVariant.discountedPrice ? (
                        <>
                            <div className="text-2xl font-bold">
                                {selectedVariant.currency} {selectedVariant.discountedPrice}
                            </div>
                            <div className="text-2xl font-bold line-through text-zinc-500">
                                {selectedVariant.currency} {selectedVariant.price}
                            </div>
                        </>
                    ) : (
                        <div className="text-2xl font-bold">
                            {selectedVariant.currency} {selectedVariant.price}
                        </div>
                    )}

                    <div className="space-y-4">
                        <div>
                            <h3 className="text-sm font-medium mb-3">SELECT SIZE</h3>
                            <RadioGroup
                                defaultValue={selectedVariant.size}
                                onValueChange={handleVariantChange}
                                className="flex flex-wrap gap-2"
                            >
                                {product.variants
                                    .filter((variant: any) => variant.size)
                                    .map((variant: any) => (
                                        <div key={variant.id}>
                                            <RadioGroupItem
                                                value={variant.size}
                                                id={`size-${variant.size}`}
                                                className="sr-only"
                                                disabled={!variant.inStock}
                                            />
                                            <Label
                                                htmlFor={`size-${variant.size}`}
                                                className={`px-4 py-2 border rounded cursor-pointer ${selectedVariant.size === variant.size
                                                        ? "border-primary bg-primary/10"
                                                        : variant.inStock
                                                            ? "border-input hover:bg-accent"
                                                            : "border-input bg-muted cursor-not-allowed opacity-50"
                                                    }`}
                                            >
                                                {variant.size}
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
                        <Button
                            className="flex-1 text-lg py-6 hover:opacity-70"
                            disabled={!selectedVariant.inStock || isAddingToCart}
                            onClick={handleAddToCart}
                        >
                            {isAddingToCart ? 'Adding...' : 'Add to cart'}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}