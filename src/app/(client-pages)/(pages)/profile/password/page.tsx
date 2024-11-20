import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
export default function Password() {
    return (
        <>

            <div className="md:w-2/6 mx-auto p-5">
                <div className="my-4">
                    <Input placeholder="Old Password" type="password" />
                </div>
                <div className="my-4">
                    <Input placeholder="New Password" type="password" />
                </div>
                <div className="w-full my-12">
                    <Button className="rounded-sm w-full">Save Changes</Button>
                </div>
            </div>
        </>
    );
}