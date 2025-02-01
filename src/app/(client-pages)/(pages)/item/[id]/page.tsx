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
import { useCart } from '@/contexts/cart'
import { addToCart } from '@/actions/cart'
import { ClipLoader } from "react-spinners"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"

//Local Types
type VariantType = {
    id: string,
    title: string,
    inStock: boolean,
    price: number,
    currency: string,
    currentlyNotInStock: boolean,
    discountedPrice: number | null,
    size: string | null
}

type ProductType = {
    id: string,
    title: string,
    inStock: boolean,
    description: string,
    images: {
        src: string,
        alt: string
    }[],
    variants: VariantType[]
}

export default function Component({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const [loading, setLoading] = useState<boolean>(false);
    const [quantity, setQuantity] = useState(1)
    const [selectedVariant, setSelectedVariant] = useState<VariantType | null>(null);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [error, setError] = useState<string>('');
    const [product, setProduct] = useState<ProductType | null>(null);
    const { cartId, refetchCart } = useCart();
    const [isAddingToCart, setIsAddingToCart] = useState(false);
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState({ title: '', description: '' });

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            setError('');
            try {
                const response = await getIndividualProduct(resolvedParams.id);
                setProduct(response.data);
                if (response.data.variants && response.data.variants.length > 0) {
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
            setAlertMessage({
                title: 'Success',
                description: 'Item has been added to your cart successfully!'
            });
        } catch (error) {
            console.error('Failed to add to cart', error);
            setAlertMessage({
                title: 'Error',
                description: 'Failed to add item to cart. Please try again.'
            });
        } finally {
            setIsAddingToCart(false);
            setAlertOpen(true);
        }
    };

    const handleVariantChange = (size: string) => {
        if (product) {
            const variant = product.variants.find(v => v.title === size);
            if (variant) {
                setSelectedVariant(variant);
            }
        }
    };

    if (loading) {
        return (
            <div className="p-4 flex justify-center items-center w-full h-64">
                <ClipLoader color="#000" size={30} />
            </div>
        );
    }

    if (error) {
        return <div className="text-center text-red-500 font-bold text-xl">{error}</div>;
    }

    if (!product || !selectedVariant) {
        return <div className="text-center font-bold text-xl">No product found</div>;
    }

    const availableSizes = product.variants
        .filter(variant => variant.title)
        .map(variant => variant.title);

    return (
        <div className="container mx-auto px-4 py-8">
            <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{alertMessage.title}</AlertDialogTitle>
                        <AlertDialogDescription>
                            {alertMessage.description}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogAction>OK</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <div className="text-sm breadcrumbs mb-8">
                <Link href="/" className="text-muted-foreground hover:text-primary">
                    E-Commerce
                </Link>
                <span className="mx-2 text-muted-foreground">/</span>
                <span>{product.title}</span>
            </div>

            {/* Rest of the component remains the same */}
            <div className="grid md:grid-cols-2 gap-8">
                {/* Image Section */}
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
                        {product.images.map((image, index) => (
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

                {/* Product Info Section */}
                <div className="space-y-6">
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-2xl font-bold mb-2">{product.title}</h1>
                            <div className="flex items-center space-x-2">
                                {(selectedVariant.inStock || selectedVariant.currentlyNotInStock) ? (
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

                    {/* Price Display */}
                    {selectedVariant.discountedPrice ? (
                        <div className="space-y-2">
                            <div className="text-2xl font-bold">
                                {selectedVariant.currency} {selectedVariant.discountedPrice}
                            </div>
                            <div className="text-2xl font-bold line-through text-zinc-500">
                                {selectedVariant.currency} {selectedVariant.price}
                            </div>
                        </div>
                    ) : (
                        <div className="text-2xl font-bold">
                            {selectedVariant.currency} {selectedVariant.price}
                        </div>
                    )}

                    {/* Variant Selection */}
                    <div className="space-y-4">
                        {availableSizes.length > 0 && (
                            <div>
                                <h3 className="text-sm font-medium mb-3">SELECT SIZE</h3>
                                <RadioGroup
                                    defaultValue={selectedVariant.title}
                                    onValueChange={handleVariantChange}
                                    className="flex flex-wrap gap-2"
                                >
                                    {availableSizes.map((size) => {
                                        const variant = product.variants.find(v => v.title === size);
                                        const isAvailable = variant?.inStock || variant?.currentlyNotInStock;

                                        return (
                                            <div key={size}>
                                                <RadioGroupItem
                                                    value={size}
                                                    id={`size-${size}`}
                                                    className="sr-only"
                                                    disabled={!isAvailable}
                                                />
                                                <Label
                                                    htmlFor={`size-${size}`}
                                                    className={`px-4 py-2 border rounded cursor-pointer ${selectedVariant.title === size
                                                        ? "border-primary bg-primary/10"
                                                        : isAvailable
                                                            ? "border-input hover:bg-accent"
                                                            : "border-input bg-muted cursor-not-allowed opacity-50"
                                                        }`}
                                                >
                                                    {size}
                                                </Label>
                                            </div>
                                        );
                                    })}
                                </RadioGroup>
                            </div>
                        )}

                        {/* Quantity Selection */}
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

                    {/* Add to Cart Button */}
                    <div className="flex space-x-4">
                        <Button
                            className="flex-1 text-lg py-6 hover:opacity-70"
                            disabled={!selectedVariant.inStock || isAddingToCart || selectedVariant.currentlyNotInStock}
                            onClick={handleAddToCart}
                        >
                            {isAddingToCart ? 'Adding...' : 'Add to cart'}
                        </Button>
                    </div>

                    {/* Product Description */}
                    {product.description && (
                        <div className="mt-8">
                            <h3 className="text-lg font-medium mb-2">Description</h3>
                            <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: product.description }} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}