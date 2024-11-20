import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
export default function Orders() {
    const Item = () => {
        return (
            <>
                <div className="flex flex-col md:flex-row justify-center md:justify-between items-center w-full border-b-2 border-border py-8">
                    <div className="flex flex-col md:flex-row items-center justify-center">
                        <Image src={'https://picsum.photos/150'} height={150} width={150} alt="Sample Cart Photo" />
                        <div className="flex flex-col justify-center items-center md:items-start md:ml-8 gap-y-2">
                            <h1 className="text-xl font-bold">Product Title</h1>
                            <p>Size: M</p>
                            <p>Ordered On: 24 July 2024</p>
                            <p className="font-bold">$100.00</p>
                        </div>
                    </div>
                    <div className="flex items-center flex-col md:flex-row gap-y-4 md:gap-y-0 mt-6">
                        <p className="text-lg font-bold mx-3">Processing</p>
                        <div className="flex items-center gap-x-4 border border-ring text-xl mx-3">
                            <Button variant="ghost" className="rounded-sm" asChild>
                                <Link href="/item">
                                    View Item
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </>
        )
    }
    return (
        <>
            <div className="px-10 overflow-y-scroll h-full">
                <Item />
                <Item />
                <Item />
                <Item />
            </div>
        </>
    );
}