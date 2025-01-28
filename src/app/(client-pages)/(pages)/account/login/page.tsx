"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { FcGoogle } from "react-icons/fc";
import Link from "next/link";
import { signIn, useSession } from 'next-auth/react';
import { useActionState } from "react";
import { login } from "@/actions/authentication";
// import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { redirect } from "next/navigation";
import { ClipLoader } from "react-spinners";

export default function Login() {
    const [state, formAction, pending] = useActionState(login, {
        status: '',
        message: '',
    });
    // const { theme } = useTheme();
    const [formState, setFormState] = useState({ email: '', password: '' });
    const [googleLoading, setGoogleLoading] = useState(false);
    const { status } = useSession();

    if (status === 'authenticated') redirect('/home');

    useEffect(() => {
        if (state.status === 'success') {
            signIn('credentials', {
                email: formState.email,
                password: formState.password,
                redirect: true,
                callbackUrl: `${process.env.SHOPIFY_STORE_DOMAIN}/home`
            });
        }
    }, [state.status, formState]);

    const handleGoogleSignIn = async (e: React.MouseEvent) => {
        e.preventDefault();
        try {
            setGoogleLoading(true);
            await signIn('google', {
                callbackUrl: `${process.env.SHOPIFY_STORE_DOMAIN}/home`
            });
        } catch (error) {
            console.error('Google sign in error:', error);
            setGoogleLoading(false);
        }
    };

    return (
        <div className="mx-auto container mb-12">
            <div className="flex justify-center items-center">
                <form action={formAction} className="w-80 flex flex-col items-center">
                    <Button
                        onClick={handleGoogleSignIn}
                        type="button"
                        className="
                            bg-background
                            text-foreground
                            w-full
                            hover:bg-neutral-100
                            dark:hover:bg-neutral-900
                            transition-color
                            duration-200
                            border border-secondary
                            rounded-sm
                            p-6
                            shadow-md
                            flex
                            items-center
                            justify-center
                            gap-2
                        "
                        disabled={googleLoading || pending}
                    >
                        {googleLoading ? (
                            <div className="p-4 flex justify-center items-center">
                                <ClipLoader color="#000" size={24} />
                            </div>
                        ) : (
                            <>
                                Authenticate with Google
                                <FcGoogle className="text-xl" />
                            </>
                        )}
                    </Button>

                    <div className="flex justify-center items-center my-6">
                        <Separator className="w-24" />
                        <p className="mx-2">OR</p>
                        <Separator className="w-24" />
                    </div>

                    <div className="w-full space-y-8">
                        <div>
                            <Input
                                placeholder="Email"
                                className={`
                                    rounded-sm
                                    ${state.errors?.email ? 'border border-destructive' : ''}
                                `}
                                type="email"
                                name="email"
                                required
                                value={formState.email}
                                onChange={(e) => setFormState(prev => ({ ...prev, email: e.target.value }))}
                                disabled={pending}
                            />
                            {state.errors?.email && (
                                <div className="text-sm text-destructive mt-2">
                                    {state.errors.email.map((error, index) => (
                                        <div key={index} className="my-1">{error}</div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div>
                            <Input
                                placeholder="Password"
                                className={`
                                    rounded-sm 
                                    mb-3
                                    ${state.errors?.password ? 'border border-destructive' : ''}
                                `}
                                type="password"
                                name="password"
                                required
                                value={formState.password}
                                onChange={(e) => setFormState(prev => ({ ...prev, password: e.target.value }))}
                                disabled={pending}
                            />
                            {state.errors?.password && (
                                <div className="text-sm text-destructive my-2">
                                    {state.errors.password.map((error, index) => (
                                        <div key={index} className="my-1">{error}</div>
                                    ))}
                                </div>
                            )}
                            <Link
                                href="/auth/reset-password"
                                className="text-right text-sm font-bold hover:text-neutral-500 transition-color duration-200 block"
                            >
                                Forgot Password?
                            </Link>
                        </div>

                        <div>
                            <Button
                                className="w-full rounded-sm"
                                type="submit"
                                disabled={pending || googleLoading}
                            >
                                Submit {pending && (
                                    <div className="p-4 flex justify-center items-center">
                                        <ClipLoader color="#000" size={24} />
                                    </div>
                                )}
                            </Button>
                        </div>

                        {state.status === 'success' && (
                            <div className="text-green-700 dark:text-green-300 text-center">
                                {state.message}
                            </div>
                        )}

                        <div className="text-center">
                            <p>
                                Do not have an account?
                                <Link
                                    href="/auth/register"
                                    className="ml-1 font-bold hover:text-neutral-500 transition-color duration-200"
                                >
                                    Sign Up Here
                                </Link>
                            </p>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
