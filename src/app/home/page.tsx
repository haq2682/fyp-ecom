import { Button } from "@/components/ui/button";
import Image from "next/image";
import { FaArrowRight } from "react-icons/fa6";
import { LuShieldCheck, LuTruck } from "react-icons/lu";
import { RiMedalLine } from "react-icons/ri";
export default function Home() {
    const ProductItem = () => {
        return (
            <>
                <div className="my-4 mx-2 relative">
                    <span className="absolute text-white bg-black py-1 px-3">SALE</span>
                    <Image src={'https://picsum.photos/300/500'} width={300} height={500} alt="Sample Product Photo" />
                    <div className="my-4">
                        <h4 className="text-lg font-bold">Product Title</h4>
                    </div>
                    <div className="my-4 flex justify-between">
                        <div className="text-sm p-1.5 border border-border text-center bg-background rounded-lg text-green-500">IN STOCK</div>
                        <div className="space-x-2">
                            <span className="font-bold">
                                $6.99
                            </span>
                            <span className="line-through text-zinc-500">
                                $9.99
                            </span>
                        </div>
                    </div>
                </div>

            </>
        )
    }
    return (
        <>
            <div className="space-y-12">
                <div className="bg-secondary">
                    <div className="mx-auto container flex flex-col items-center md:flex-row md:justify-between py-8 px-12">
                        <div className="text-center md:text-left">
                            <h1 className="text-2xl font-bold">Fresh Arrivals Online</h1>
                            <p className="text-gray-500">Get the latest fashion trends and styles</p>
                            <Button className="bg-primary py-2 px-4 rounded-sm hover:bg-secondary mt-12">View Collection <FaArrowRight size={24} /></Button>
                        </div>
                        <div className="mt-16 md:mt-0">
                            <Image src="https://picsum.photos/400" width={400} height={400} alt="Sample Photo" />
                        </div>
                    </div>
                </div>
                <div className="mx-auto container">
                    <div className="bg-background">
                        <div className="mx-auto container flex flex-col md:flex-row md:justify-between items-center md:items-start py-8 px-12 flex-wrap my-16">
                            <div className="space-y-6 w-64 flex flex-col justify-center items-center md:items-start h-full my-6">
                                <div className="bg-secondary p-2 w-10 aspect-square rounded-full">
                                    <LuTruck size={24} />
                                </div>
                                <h1 className="text-lg font-bold">Free Shipping</h1>
                                <p className="text-center md:text-left">Upgrade your style today and get FREE shipping on all orders!</p>
                            </div>
                            <div className="space-y-6 w-64 flex flex-col justify-center items-center md:items-start h-full my-6">
                                <div className="bg-secondary p-2 w-10 aspect-square rounded-full">
                                    <RiMedalLine size={24} />
                                </div>
                                <h1 className="text-lg font-bold text-center md:text-left">Satisfaction Guarantee</h1>
                                <p className="text-center md:text-left">Ship confidently with our Satisfaction Guarantee: Love it or get a refund.</p>
                            </div>
                            <div className="space-y-6 w-64 flex flex-col justify-center items-center md:items-start my-6">
                                <div className="bg-secondary p-2 w-10 aspect-square rounded-full">
                                    <LuShieldCheck size={24} />
                                </div>
                                <h1 className="text-lg font-bold text-center md:text-left">Secure Payment</h1>
                                <p className="text-center md:text-left">Your security is our priority. Your payments are secure with us.</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mx-auto container space-y-16">
                    <div className="text-center">
                        <h5 className="text-zinc-500 font-black">SHOP NOW</h5>
                        <h1 className="text-3xl font-bold">Best Selling</h1>
                    </div>
                    <div className="flex items-center flex-wrap justify-center md:justify-between">
                        <ProductItem />
                        <ProductItem />
                        <ProductItem />
                        <ProductItem />
                    </div>
                </div>
                <div className="bg-secondary">
                    <div className="mx-auto container flex flex-col items-center md:flex-row md:justify-between py-8 px-12">
                        <div className="text-center md:text-left">
                            <h1 className="text-2xl font-bold">Browse Our Fashion Paradise!</h1>
                            <p className="text-gray-500">Step into a world of style and explore our diverse collection of clothing categories.</p>
                            <Button className="bg-primary py-2 px-4 rounded-sm hover:bg-secondary mt-12">View Collection <FaArrowRight size={24} /></Button>
                        </div>
                        <div className="mt-16 md:mt-0">
                            <Image src="https://picsum.photos/400" width={400} height={400} alt="Sample Photo" />
                        </div>
                    </div>
                </div>
                <div className="mx-auto container space-y-16 pb-24">
                    <div className="text-center">
                        <h5 className="text-zinc-500 font-black">SHOP NOW</h5>
                        <h1 className="text-3xl font-bold">Latest</h1>
                    </div>
                    <div className="flex items-center flex-wrap justify-center md:justify-between">
                        <ProductItem />
                        <ProductItem />
                        <ProductItem />
                        <ProductItem />
                    </div>
                </div>
            </div >
        </>
    )
}