import { Separator } from "@/components/ui/separator"
import Image from "next/image"
import { FiPlus, FiMinus } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { FaRegTrashCan } from "react-icons/fa6";
import Link from "next/link";

export default function Cart() {
    const CartItem = () => {
        return (
            <>
                <div className="flex flex-col md:flex-row justify-center md:justify-between items-center w-full border-b-2 border-border py-8">
                    <div className="flex flex-col md:flex-row items-center justify-center">
                        <Image src={'https://picsum.photos/150'} height={150} width={150} alt="Sample Cart Photo" />
                        <div className="flex flex-col justify-center items-center md:items-start md:ml-8 gap-y-2 md:gap-y-4">
                            <h1 className="text-xl font-bold">Product Title</h1>
                            <p>Size: M</p>
                        </div>
                    </div>
                    <div className="flex items-center flex-col md:flex-row gap-y-4 md:gap-y-0 mt-6">
                        <p className="text-lg font-bold mx-3">$100.00</p>
                        <div className="flex items-center gap-x-4 border border-ring text-xl mx-3">
                            <div>
                                <Button variant="ghost" className="rounded-none">
                                    <FiMinus size={20} />
                                </Button>
                            </div>
                            <div>1</div>
                            <div>
                                <Button variant="ghost" className="rounded-none">
                                    <FiPlus size={20} />
                                </Button>
                            </div>
                        </div>
                        <div>
                            <Button variant="ghost" size={"icon"}>
                                <FaRegTrashCan size={30} />
                            </Button>
                        </div>
                    </div>
                </div>
            </>
        )
    }
    return (
        <>
            <div className="mx-auto container mb-12">
                <div className="flex justify-between items-start mb-4 w-full">
                    <div className="w-8/12">
                        <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
                        <Separator orientation="horizontal" className="my-6" />
                        <CartItem />
                        <CartItem />
                        <CartItem />
                    </div>
                    <div className="border border-border p-4 w-3/12 mt-12 space-y-3">
                        <div className="mb-8">
                            <h1 className="font-bold text-2xl">Order Summary</h1>
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
                            <Button asChild className="mt-8" size={"lg"}>
                                <Link href="/checkout">
                                    Checkout
                                </Link>
                            </Button>
                        </div>
                        <div className="flex justify-center">
                            <Button variant="link" asChild className="underline mt-4">
                                <Link href="/home">
                                    Continue Shopping
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}