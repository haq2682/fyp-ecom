'use client'

import { Separator } from "@/components/ui/separator"
import Image from "next/image"
import { FiMinus, FiPlus } from "react-icons/fi"
import { Button } from "@/components/ui/button"
import { FaRegTrashCan } from "react-icons/fa6"
import Link from "next/link"
import { useCart } from '@/contexts/cart'
import { updateCart, removeFromCart } from '@/actions/cart'
import { useState, useEffect } from 'react'
import { toast } from 'sonner';
import { Cart } from '@/types'

//Local Types
type CartItemLine = Cart["lines"]["edges"][0]["node"]
type CartLinesEdge = Cart["lines"]["edges"][0]


export default function CartPage() {
    const { cart, cartId, refetchCart } = useCart();
    const [currency, setCurrency] = useState<string>('');
    const [updatingLines, setUpdatingLines] = useState<Set<string>>(new Set());

    useEffect(() => {
        if(cart) setCurrency(cart.lines.edges[0]?.node.merchandise.price.currencyCode);
    }, [cart]);

    const handleUpdateQuantity = async (lineId: string, currentQuantity: number, increment: number) => {
        const newQuantity = currentQuantity + increment;
        if (newQuantity < 0) return;

        setUpdatingLines(prev => new Set(prev).add(lineId));
        try {
            if (newQuantity === 0) {
                await removeFromCart(cartId!, lineId);
            } else {
                await updateCart(cartId!, lineId, newQuantity);
            }
            await refetchCart();
        } catch (error) {
            toast.error('Failed to update cart');
        } finally {
            setUpdatingLines(prev => {
                const next = new Set(prev);
                next.delete(lineId);
                return next;
            });
        }
    };

    const handleRemoveItem = async (lineId: string) => {
        setUpdatingLines(prev => new Set(prev).add(lineId));
        try {
            await removeFromCart(cartId!, lineId);
            await refetchCart();
            toast.success('Item removed from cart');
        } catch (error) {
            toast.error('Failed to remove item');
        } finally {
            setUpdatingLines(prev => {
                const next = new Set(prev);
                next.delete(lineId);
                return next;
            });
        }
    };

    const CartItem = ({ line }: { line: CartItemLine }) => {
        const isUpdating = updatingLines.has(line.id);

        return (
            <div className="flex flex-col md:flex-row justify-center md:justify-between items-center w-full border-b-2 border-border py-8">
                <div className="flex flex-col md:flex-row items-center justify-center">
                    <Image
                        src={line.merchandise.product.images.edges[0]?.node.url || '/placeholder.jpg'}
                        height={150}
                        width={150}
                        alt={line.merchandise.product.title}
                    />
                    <div className="flex flex-col justify-center items-center md:items-start md:ml-8 gap-y-2 md:gap-y-4">
                        <h1 className="text-xl font-bold">{line.merchandise.product.title}</h1>
                        <p>Size: {line.merchandise.title}</p>
                    </div>
                </div>
                <div className="flex items-center flex-col md:flex-row gap-y-4 md:gap-y-0 mt-6">
                    <p className="text-lg font-bold mx-3">
                        {line.merchandise.price.currencyCode} {line.merchandise.price.amount}
                    </p>
                    <div className="flex items-center gap-x-4 border border-ring text-xl mx-3">
                        <Button
                            variant="ghost"
                            className="rounded-none"
                            disabled={isUpdating}
                            onClick={() => handleUpdateQuantity(line.id, line.quantity, -1)}
                        >
                            <FiMinus size={20} />
                        </Button>
                        <div>{line.quantity}</div>
                        <Button
                            variant="ghost"
                            className="rounded-none"
                            disabled={isUpdating}
                            onClick={() => handleUpdateQuantity(line.id, line.quantity, 1)}
                        >
                            <FiPlus size={20} />
                        </Button>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        disabled={isUpdating}
                        onClick={() => handleRemoveItem(line.id)}
                    >
                        <FaRegTrashCan size={30} />
                    </Button>
                </div>
            </div>
        );
    }

    if (!cart || !cart.lines.edges.length) {
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                <h1 className="text-2xl font-bold mb-4">Your Cart is Empty</h1>
                <Button asChild className="mt-4">
                    <Link href="/">Continue Shopping</Link>
                </Button>
            </div>
        );
    }

    const cartLines = cart.lines.edges.map((edge: CartLinesEdge): CartItemLine => edge.node);
    const subtotal = cartLines.reduce((acc: number, line: any) => acc + (parseFloat(line.merchandise.price.amount) * line.quantity), 0);
    const shipping = 250.00;
    const total = subtotal + shipping;

    return (
        <div className="mx-auto container mb-12">
            <div className="flex flex-col md:flex-row justify-between items-start mb-4 w-full">
                <div className="w-full md:w-8/12">
                    <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
                    <Separator orientation="horizontal" className="my-6" />
                    {cartLines.map((line: any) => (
                        <CartItem key={line.id} line={line} />
                    ))}
                </div>
                <div className="border border-border p-4 w-full md:w-3/12 mt-12 space-y-3">
                    <div className="mb-8">
                        <h1 className="font-bold text-2xl">Order Summary</h1>
                    </div>
                    <div className="flex justify-between">
                        <p>Subtotal</p>
                        <p className="font-bold">{currency} {subtotal.toFixed(2)}</p>
                    </div>
                    <div className="flex justify-between">
                        <p>Shipping</p>
                        <p className="font-bold">{currency} {shipping.toFixed(2)}</p>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                        <p>Grand Total</p>
                        <p className="font-bold">{currency} {total.toFixed(2)}</p>
                    </div>
                    <div className="flex justify-center">
                        <Button
                            asChild
                            className="mt-8 w-full rounded-sm"
                            size="lg"
                        >
                            <Link href={cart.checkoutUrl}>
                                Checkout
                            </Link>
                        </Button>
                    </div>
                    <div className="flex justify-center">
                        <Button variant="link" asChild className="underline mt-4">
                            <Link href="/">
                                Continue Shopping
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}