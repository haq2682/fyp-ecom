import { HomeProduct } from "@/types"
import Image from "next/image"
import { useRouter } from "next/navigation"
export default function ProductItem({id, inStock, price, discountedPrice, currency, imageAlt, imageSrc, title}: HomeProduct) {
    const router = useRouter();
    const handleClick = () => {
        router.push(`/item/${id}`);
    }
    return (
        <>
            <div className="my-4 mx-2 relative cursor-pointer" onClick={handleClick}>
                {
                    discountedPrice ? (
                        <>
                            <span className="absolute text-white bg-black py-1 px-3">SALE</span>
                        </>
                    ) : (<></>)
                }
                <Image src={imageSrc} width={300} height={600} alt={imageAlt || 'Untitled'} />
                <div className="my-4">
                    <h4 className="text-lg font-bold">{title}</h4>
                </div>
                <div className="my-4 flex justify-between">
                    {
                        inStock ? (
                            <>
                                <div className="text-sm p-1.5 border border-border text-center bg-background rounded-lg text-green-500">IN STOCK</div>
                            </>
                        ) : (
                            <>
                                <div className="text-sm p-1.5 border border-border text-center bg-background rounded-lg text-red-500">OUT OF STOCK</div>
                            </>
                        )
                    }
                    <div className="space-x-2">
                        {
                            discountedPrice ? (
                                <>
                                    <span className="font-bold">
                                        {currency} {discountedPrice}
                                    </span>
                                    <span className="line-through text-zinc-500">
                                        {currency} {price}
                                    </span>
                                </>
                            ) : (
                                <>
                                    <span className="font-bold">
                                        {currency} {price}
                                    </span>
                                </>
                            )
                        }
                    </div>
                </div>
            </div>

        </>
    )
}