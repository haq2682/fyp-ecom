"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { FcGoogle } from "react-icons/fc";
import Link from "next/link";
import { signIn } from 'next-auth/react';
import { login } from "@/actions/authentication";
import { useState, Suspense } from "react";
import { ClipLoader } from "react-spinners";
import { useSearchParams } from 'next/navigation';
import { toast } from "sonner";
import type { LoginFormState } from "@/types";

function SubmitButton({ pending }: { pending: boolean }) {
    return (
        <Button
            className="w-full rounded-sm"
            type="submit"
            disabled={pending}
        >
            {pending ? (
                <div className="p-4 flex justify-center items-center">
                    <ClipLoader color="#000" size={24} />
                </div>
            ) : (
                'Submit'
            )}
        </Button>
    );
}

function LoginForm() {
    const [pending, setPending] = useState(false);
    const [formState, setFormState] = useState<LoginFormState>({
        status: '',
        message: '',
        errors: undefined
    });
    const [googleLoading, setGoogleLoading] = useState(false);
    const searchParams = useSearchParams();
    const checkoutUrl = searchParams.get('checkout_url');

    const handleFormSubmit = async (formData: FormData) => {
        setPending(true);
        try {
            if (checkoutUrl) {
                formData.append('checkoutUrl', checkoutUrl);
            }

            const result = await login(formState, formData);
            setFormState(result);

            if (result.status === 'success') {
                toast.success('Login successful');

                const signInResult = await signIn('credentials', {
                    email: formData.get('email'),
                    password: formData.get('password'),
                    redirect: false,
                });

                if (signInResult?.error) {
                    toast.error("Failed to authenticate with NextAuth");
                    return;
                }

                // Handle redirect based on the response
                if (result.redirectUrl) {
                    window.location.href = result.redirectUrl;
                } else {
                    window.location.href = '/';
                }
            } else if (result.status === 'error') {
                if (result.message) {
                    toast.error(result.message);
                }
            }
        } catch (error) {
            console.error('Form submission error:', error);
            const errorMessage = error instanceof Error ? error.message : 'An error occurred during login';
            toast.error(errorMessage);
            setFormState({
                status: 'error',
                message: errorMessage,
                errors: undefined
            });
        } finally {
            setPending(false);
        }
    };

    const handleGoogleSignIn = async (e: React.MouseEvent) => {
        e.preventDefault();
        try {
            setGoogleLoading(true);
            await signIn('google', {
                callbackUrl: checkoutUrl || '/',
                redirect: true,
            });
        } catch (error) {
            console.error('Google sign in error:', error);
            toast.error("Failed to authenticate with Google");
        } finally {
            setGoogleLoading(false);
        }
    };

    return (
        <form action={handleFormSubmit} className="w-80 flex flex-col items-center">
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
                            ${formState.errors?.email ? 'border border-destructive' : ''}
                        `}
                        type="email"
                        name="email"
                        required
                        disabled={pending || googleLoading}
                    />
                    {formState.errors?.email && (
                        <div className="text-sm text-destructive mt-2">
                            {formState.errors.email.map((error, index) => (
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
                            ${formState.errors?.password ? 'border border-destructive' : ''}
                        `}
                        type="password"
                        name="password"
                        required
                        disabled={pending || googleLoading}
                    />
                    {formState.errors?.password && (
                        <div className="text-sm text-destructive my-2">
                            {formState.errors.password.map((error, index) => (
                                <div key={index} className="my-1">{error}</div>
                            ))}
                        </div>
                    )}
                    <Link
                        href="/account/forgot-password"
                        className="text-right text-sm font-bold hover:text-neutral-500 transition-color duration-200 block"
                    >
                        Forgot Password?
                    </Link>
                </div>

                <div>
                    <SubmitButton pending={pending} />
                </div>

                <div className="text-center">
                    <p>
                        Do not have an account?
                        <Link
                            href="/account/register"
                            className="ml-1 font-bold hover:text-neutral-500 transition-color duration-200"
                        >
                            Sign Up Here
                        </Link>
                    </p>
                </div>
            </div>
        </form>
    );
}

export default function LoginPage() {
    return (
        <div className="mx-auto container mb-12">
            <div className="flex justify-center items-center">
                <Suspense
                    fallback={
                        <div className="flex justify-center items-center h-screen">
                            <ClipLoader color="#000" size={50} />
                        </div>
                    }
                >
                    <LoginForm />
                </Suspense>
            </div>
        </div>
    );
}
