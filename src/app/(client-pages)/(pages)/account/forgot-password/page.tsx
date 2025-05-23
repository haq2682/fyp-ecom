"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { useActionState } from "react"
import { forgotPassword } from "@/actions/authentication"
import { ClipLoader } from "react-spinners"
import { useState } from "react"

export default function ForgotPassword() {
  const [state, formAction, pending] = useActionState(forgotPassword, {
    status: "",
    message: "",
  })
  const [email, setEmail] = useState("")

  return (
    <div className="mx-auto container mb-12">
      <div className="flex justify-center items-center">
        <form action={formAction} className="w-80 flex flex-col items-center">
          <h2 className="text-2xl font-bold mb-6">Forgot Password</h2>
          <div className="w-full space-y-8">
            <div>
              <Input
                placeholder="Email"
                className={`
                                    rounded-sm
                                    ${state.errors?.email ? "border border-destructive" : ""}
                                `}
                type="email"
                name="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={pending}
              />
              {state.errors?.email && (
                <div className="text-sm text-destructive mt-2">
                  {state.errors.email.map((error, index) => (
                    <div key={index} className="my-1">
                      {error}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
             <Button className="w-full rounded-sm flex justify-center items-center" type="submit" disabled={pending}>
              {pending ? (
                    <ClipLoader color="#000" size={24} />
                ) : (
                      "Reset Password"
                    )}
              </Button>

            </div>

            {state.status === "success" && (
              <div className="text-green-700 dark:text-green-300 text-center">{state.message}</div>
            )}

            <div className="text-center">
              <p>
                Remember your password?
                <Link
                  href="/account/login"
                  className="ml-1 font-bold hover:text-neutral-500 transition-color duration-200"
                >
                  Login Here
                </Link>
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

