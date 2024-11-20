import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
export default function Address() {
    return (
        <>
            <div className="md:w-2/6 mx-auto p-5">
                <div className="w-full space-y-4">
                    <div className="w-full">
                        <Input placeholder="Street Address" />
                    </div>
                    <div className="w-full flex gap-x-6">
                        <Input placeholder="City" className="w-1/2" />
                        <Input placeholder="State" className="w-1/2" />
                    </div>
                    <div className="w-full flex gap-x-6">
                        <Input placeholder="Zip Code" className="w-1/2" />
                        <Input placeholder="Country" className="w-1/2" />
                    </div>
                    <div className="w-full">
                        <Button className="rounded-sm w-full mt-12">Save Changes</Button>
                    </div>
                </div>
            </div>
        </>
    );
}