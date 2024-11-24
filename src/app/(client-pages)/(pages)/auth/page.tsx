"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { FcGoogle } from "react-icons/fc";
import Link from "next/link";
import { signIn } from 'next-auth/react';

export default function Login() {
    return (
        <>
            <div className="mx-auto container mb-12">
                <div className="flex justify-center items-center">
                    <div className="w-80 flex flex-col items-center">
                        <Button onClick={() => signIn('google')} className="bg-background text-foreground w-full hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-color duration-200 border border-secondary rounded-sm p-6 shadow-md">Authenticate with Google<FcGoogle /></Button>
                        <div className="flex justify-center items-center my-6">
                            <Separator className="w-24" />
                            <p className="mx-2">OR</p>
                            <Separator className="w-24" />
                        </div>
                        <div className="w-full space-y-8">
                            <div>
                                <Input placeholder="Email" className="rounded-sm" type="email" required />
                            </div>
                            <div>
                                <Input placeholder="Password" className="rounded-sm mb-3" type="password" required />
                                <Link href="/auth/reset-password" className="text-right text-sm font-bold hover:text-neutral-500 transition-color duration-200">
                                    <p>Forgot Password?</p>
                                </Link>
                            </div>
                            <div>
                                <Button className="w-full rounded-sm">Submit</Button>
                            </div>
                            <div className="text-center">
                                <p>Do not have an account?
                                    <Link href="/auth/register" className="ml-1 font-bold hover:text-neutral-500 transition-color duration-200">
                                        Sign Up Here
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