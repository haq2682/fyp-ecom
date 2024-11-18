import Image from "next/image"
export default function ProductItem() {
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