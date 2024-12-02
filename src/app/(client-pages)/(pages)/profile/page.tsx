"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signOut } from "next-auth/react";

export default function Profie() {
    return (
        <>
            <div className="md:w-2/6 mx-auto p-5">
                <div className="my-4">
                    <Input placeholder="Username" />
                </div>
                <div className="my-4">
                    <Input placeholder="Email" type="email" />
                </div>
                <div className="flex flex-col my-12 gap-y-4">
                    <Button className="rounded-sm">Save Changes</Button>
                    <Button onClick={() => signOut()} className="rounded-sm" variant="ghost">Log Out</Button>
                    <Button className="rounded-sm" variant="destructive">Delete Account</Button>
                </div>
            </div>
        </>
    )
}