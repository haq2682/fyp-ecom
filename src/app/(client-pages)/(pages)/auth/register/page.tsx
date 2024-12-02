import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
export default function Register() {
    return (
        <>
            <div className="mx-auto container mb-12">
                <div className="flex justify-center items-center">
                    <div className="w-80 flex flex-col items-center">
                        <div className="w-full space-y-8">
                            <div>
                                <Input placeholder="Username" type="text" className="rounded-sm" required />
                            </div>
                            <div>
                                <Input placeholder="Email" type="email" className="rounded-sm" required />
                            </div>
                            <div>
                                <Input placeholder="Password" type="password" className="rounded-sm mb-3" required />
                            </div>
                            <div>
                                <Button className="w-full rounded-sm">Submit</Button>
                            </div>
                            <div className="text-center">
                                <p>Already have an account?
                                    <Link href="/auth" className="ml-1 font-bold hover:text-neutral-500 transition-color duration-200">
                                        Log In Here
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}