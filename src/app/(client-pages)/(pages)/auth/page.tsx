"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { FcGoogle } from "react-icons/fc";
import Link from "next/link";
import { signIn } from 'next-auth/react';
import { useFormState, useFormStatus } from "react-dom";
import { login } from "@/actions/authentication";
import Loading from "@/components/ui/loading";
import { useTheme } from "next-themes";
import { useState } from "react";

export default function Login() {
    const { pending } = useFormStatus();
    const [state, formAction] = useFormState(login, {
        status: '',
        message: '',
    });
    const { theme } = useTheme();
    const [formState, setFormState] = useState({ email: '', password: '' });

    return (
        <>
            <div className="mx-auto container mb-12">
                <div className="flex justify-center items-center">
                    <form action={formAction} className="w-80 flex flex-col items-center">
                        <Button
                            onClick={() => signIn('google')}
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
                                "
                            disabled={pending}
                        >
                            Authenticate with Google<FcGoogle />
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
                                        ${state.errors?.email && 'border border-destructive'
                                        }
                                    `}
                                    type="email"
                                    name="email"
                                    required
                                    value={formState.email}
                                    onChange={(event) => setFormState((previousState) => ({ ...previousState, email: event.target.value }))}
                                />
                                <div className="text-sm text-destructive mt-2">
                                    {
                                        state.errors?.email && (state.errors?.email?.map((error) => error))
                                    }
                                </div>
                            </div>
                            <div>
                                <Input
                                    placeholder="Password"
                                    className={`
                                        rounded-sm 
                                        mb-3
                                        ${
                                            state.errors?.password && 'border border-destructive'
                                        }
                                    `}
                                    type="password"
                                    name="password"
                                    required
                                    value={formState.password}
                                    onChange={(event) => setFormState((previousState) => ({ ...previousState, password: event.target.value }))}
                                />
                                <div className="text-sm text-destructive my-2">
                                    {
                                        state.errors?.password && (state.errors?.password?.map((error) => error))
                                    }
                                </div>
                                <Link href="/auth/reset-password" className="text-right text-sm font-bold hover:text-neutral-500 transition-color duration-200">
                                    <p>Forgot Password?</p>
                                </Link>
                            </div>
                            <div>
                                <Button
                                    className="
                                        w-full 
                                        rounded-sm
                                    "
                                    type="submit"
                                    disabled={pending}
                                >
                                    Submit {pending && <Loading propColor={theme === 'light' ? 'white' : 'black'} propSize={20} />}
                                </Button>
                            </div>
                            <div className="text-green-700 dark:text-green-300 text-center">
                                {
                                    state.status === 'success' && state.message
                                }
                            </div>
                            <div className="text-center">
                                <p>Do not have an account?
                                    <Link href="/auth/register" className="ml-1 font-bold hover:text-neutral-500 transition-color duration-200">
                                        Sign Up Here
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}