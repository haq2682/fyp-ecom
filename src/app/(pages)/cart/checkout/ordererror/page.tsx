import { RiEmotionUnhappyLine } from "react-icons/ri";
export default function OrderError() {
    return (
        <>
            <div className="flex flex-col justify-center items-center mb-12 space-y-8">
                <div className="text-3xl font-bold flex">An Unknown Error occurred while placing your Order! <RiEmotionUnhappyLine size={38} className="ml-2" /></div>
                <div>Please try again later.</div>
            </div>
        </>
    )
}