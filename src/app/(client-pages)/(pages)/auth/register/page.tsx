"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useActionState, useState } from "react";
import { register } from "@/actions/authentication";
// import { useTheme } from "next-themes";
import { ClipLoader } from "react-spinners"
export default function Register() {
    // const { theme } = useTheme();
    const [state, formAction, pending] = useActionState(register, {
        status: '',
        message: ''
    })
    const [formState, setFormState] = useState({ name: '', email: '', password: '', confirm_password: '' });
    return (
        <>
            <div className="mx-auto container mb-12">
                <div className="flex justify-center items-center">
                    <div className="w-80 flex flex-col items-center">
                        <form action={formAction} className="w-full space-y-8">
                            <div>
                                <Input
                                    placeholder="Full Name"
                                    type="text"
                                    className={`
                                        rounded-sm
                                        ${state.errors?.name && 'border border-destructive'
                                        }
                                    `}
                                    required
                                    name="name"
                                    value={formState.name}
                                    onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                                />
                                <div className="text-sm text-destructive mt-2">
                                    {
                                        state.errors?.name && (state.errors?.name?.map((error, index) => <div key={index} className="my-1">{error}</div>))
                                    }
                                </div>
                            </div>
                            <div>
                                <Input
                                    placeholder="Email"
                                    type="email"
                                    className={`
                                        rounded-sm
                                        ${state.errors?.email && 'border border-destructive'
                                        }
                                    `}
                                    required
                                    name="email"
                                    value={formState.email}
                                    onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                                />
                                <div className="text-sm text-destructive mt-2">
                                    {
                                        state.errors?.email && (state.errors?.email?.map((error, index) => <div key={index} className="my-1">{error}</div>))
                                    }
                                </div>
                            </div>
                            <div>
                                <Input
                                    placeholder="Password"
                                    type="password"
                                    className={`
                                        rounded-sm
                                        mb-3
                                        ${state.errors?.password && 'border border-destructive'
                                        }
                                    `}
                                    required
                                    name="password"
                                    value={formState.password}
                                    onChange={(e) => setFormState({ ...formState, password: e.target.value })}
                                />
                                <div className="text-sm text-destructive mt-2">
                                    {
                                        state.errors?.password && (state.errors?.password?.map((error, index) => <div key={index} className="my-1">{error}</div>))
                                    }
                                </div>
                            </div>
                            <div>
                                <Input
                                    placeholder="Confirm Password"
                                    type="password"
                                    className={`
                                        rounded-sm
                                        mb-3
                                        ${state.errors?.confirm_password && 'border border-destructive'
                                        }
                                    `}
                                    required
                                    name="confirm_password"
                                    value={formState.confirm_password}
                                    onChange={(e) => setFormState({ ...formState, confirm_password: e.target.value })}
                                />
                                <div className="text-sm text-destructive mt-2">
                                    {
                                        state.errors?.confirm_password && (state.errors?.confirm_password?.map((error, index) => <div key={index} className="my-1">{error}</div>))
                                    }
                                </div>
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
                                    Submit {pending && <div className="p-4 flex justify-center items-center">
                                        <ClipLoader color="#000" size={24} />
                                    </div>}

                                </Button>
                            </div>
                            <div className="text-center">
                                <p>Already have an account?
                                    <Link href="/auth" className="ml-1 font-bold hover:text-neutral-500 transition-color duration-200">
                                        Log In Here
                                    </Link>
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}
