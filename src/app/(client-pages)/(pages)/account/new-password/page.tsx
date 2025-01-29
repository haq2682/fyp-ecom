import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function NewPassword() {
    return (
        <>
            <div className="mx-auto container mb-12">
                <div className="flex justify-center items-center">
                    <div className="w-80 flex flex-col items-center">
                        <div className="w-full space-y-8">
                            <div>
                                <Input placeholder="New Password" className="rounded-sm" type="password" required />
                            </div>
                            <div>
                                <Button className="w-full rounded-sm">Reset Password</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
