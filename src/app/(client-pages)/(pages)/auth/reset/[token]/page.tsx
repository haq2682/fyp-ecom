"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { resetPassword } from "@/actions/authentication"
import { ClipLoader } from "react-spinners"
import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useActionState } from "react"

interface FormState {
  password: string
  confirm_password: string
}

export default function ResetPassword() {
  const params = useParams()
  const router = useRouter()

  const initialState = {
    status: "",
    message: "",
    errors: {},
  }

  const [state, formAction] = useActionState(resetPassword, initialState)
  const [isPending, setIsPending] = useState(false)
  const [formState, setFormState] = useState<FormState>({
    password: "",
    confirm_password: "",
  })


  useEffect(() => {
    if (!params.token) {
      router.push('/auth/login')
    }
  }, [params.token, router])


  useEffect(() => {
    if (state?.status === "success") {
      setTimeout(() => {
        router.push("/auth/login")
      }, 3000)
    }
  }, [state?.status, router])


  const handleSubmit = async (formData: FormData) => {
    setIsPending(true)
    try {
      await formAction(formData)
    } finally {
      setIsPending(false)
    }
  }


  const token = params.token ? decodeURIComponent(params.token.toString()) : ''

  return (
    <div className="mx-auto container mb-12">
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <form action={handleSubmit} className="w-80 flex flex-col items-center">
          <h2 className="text-2xl font-bold mb-6">Reset Password</h2>
          <input type="hidden" name="resetToken" value={token} />

          <div className="w-full space-y-8">

            <div>
              <Input
                placeholder="New Password"
                className={`rounded-sm ${state?.errors?.password ? "border-2 border-destructive" : ""
                  }`}
                type="password"
                name="password"
                required
                value={formState.password}
                onChange={(e) =>
                  setFormState((prev) => ({
                    ...prev,
                    password: e.target.value,
                  }))
                }
                disabled={isPending}
              />
              {state?.errors?.password && (
                <div className="text-sm text-destructive mt-2">
                  {state.errors.password.map((error: string, index: number) => (
                    <div key={index} className="my-1">
                      {error}
                    </div>
                  ))}
                </div>
              )}
            </div>


            <div>
              <Input
                placeholder="Confirm New Password"
                className={`rounded-sm ${state?.errors?.confirm_password ? "border-2 border-destructive" : ""
                  }`}
                type="password"
                name="confirm_password"
                required
                value={formState.confirm_password}
                onChange={(e) =>
                  setFormState((prev) => ({
                    ...prev,
                    confirm_password: e.target.value,
                  }))
                }
                disabled={isPending}
              />
              {state?.errors?.confirm_password && (
                <div className="text-sm text-destructive mt-2">
                  {state.errors.confirm_password.map((error: string, index: number) => (
                    <div key={index} className="my-1">
                      {error}
                    </div>
                  ))}
                </div>
              )}
            </div>


            {state?.errors?._form && (
              <div className="text-sm text-destructive text-center">
                {state.errors._form.map((error: string, index: number) => (
                  <div key={index} className="my-1">
                    {error}
                  </div>
                ))}
              </div>
            )}


            <div>
              <Button
                className="w-full rounded-sm"
                type="submit"
                disabled={isPending}
              >
                Reset Password{" "}
                {isPending && (
                  <div className="p-4 flex justify-center items-center">
                    <ClipLoader color="#000" size={24} />
                  </div>
                )}
              </Button>
            </div>


            {state?.status === "success" && (
              <div className="text-green-700 dark:text-green-300 text-center">
                {state.message}
                <p className="text-sm mt-2">Redirecting to login page...</p>
              </div>
            )}


            <div className="text-center">
              <p>
                Remember your password?{" "}
                <Link
                  href="/auth"
                  className="ml-1 font-bold hover:text-neutral-500 transition-colors duration-200"
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
