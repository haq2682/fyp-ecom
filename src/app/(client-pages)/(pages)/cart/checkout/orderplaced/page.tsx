import { RiEmotionHappyLine } from "react-icons/ri";
export default function OrderPlaced() {
    return (
        <>
            <div className="flex flex-col justify-center items-center mb-12 space-y-8">
                <div className="text-3xl font-bold flex">Your Order has been placed Successfully! <RiEmotionHappyLine size={38} className="ml-2" /></div>
                <div className="text-2xl font-bold">Order ID: 85432901</div>
                <div>Thank your for shopping with us! Your order is now being processed and will be dispatched soon.</div>
            </div>
        </>
    )
}