import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
export default function ResetPassword() {
    return (
        <>
            <div className="mx-auto container mb-12">
                <div className="flex justify-center items-center">
                    <div className="w-80 flex flex-col items-center">
                        <div className="flex justify-center items-center my-6">
                            <p className="text-sm text-neutral-700 dark:text-neutral-300">Please enter the email address associated with your account. We shall promptly send you a link to reset your password if your account exists.</p>
                        </div>
                        <div className="w-full space-y-8">
                            <div>
                                <Input placeholder="Email" className="rounded-sm" type="email" required />
                            </div>
                            <div>
                                <Button className="w-full rounded-sm">Send Reset Link</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
} 