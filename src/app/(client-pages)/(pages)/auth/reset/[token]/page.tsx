/*"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { useFormState } from "react-dom"
import { resetPassword } from "@/actions/resetPassword"
import Loading from "@/components/ui/loading"
import { useTheme } from "next-themes"
import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"

export default function ResetPassword() {
  const params = useParams()
  const router = useRouter()
  const { theme } = useTheme()
  
  const initialState = {
    status: "",
    message: "",
    errors: {},
  }

  const [state, formAction] = useFormState(resetPassword, initialState)
  const [isPending, setIsPending] = useState(false)
  const [formState, setFormState] = useState({
    password: "",
    confirm_password: "",
  })

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

  return (
    <div className="mx-auto container mb-12">
      <div className="flex justify-center items-center">
        <form action={handleSubmit} className="w-80 flex flex-col items-center">
          <h2 className="text-2xl font-bold mb-6">Reset Password</h2>
          <input type="hidden" name="resetToken" value={params.token} />

          <div className="w-full space-y-8">
            <div>
              <Input
                placeholder="New Password"
                className={`
                  rounded-sm
                  ${state?.errors?.password ? "border border-destructive" : ""}
                `}
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
                className={`
                  rounded-sm
                  ${state?.errors?.confirm_password ? "border border-destructive" : ""}
                `}
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
              <Button className="w-full rounded-sm" type="submit" disabled={isPending}>
                Reset Password {isPending && <Loading propColor={theme === "light" ? "white" : "black"} propSize={20} />}
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
                  href="/auth/"
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
}*/
"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { resetPassword } from "@/actions/resetPassword"
import Loading from "@/components/ui/loading"
import { useTheme } from "next-themes"
import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useActionState } from "react"

export default function ResetPassword() {
  const params = useParams()
  const router = useRouter()
  const { theme } = useTheme()

  const initialState = {
    status: "",
    message: "",
    errors: {},
  }

  const [state, formAction] = useActionState(resetPassword, initialState)
  const [isPending, setIsPending] = useState(false)
  const [formState, setFormState] = useState({
    password: "",
    confirm_password: "",
  })

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

  return (
    <div className="mx-auto container mb-12">
      <div className="flex justify-center items-center">
        <form action={handleSubmit} className="w-80 flex flex-col items-center">
          <h2 className="text-2xl font-bold mb-6">Reset Password</h2>
          <input type="hidden" name="resetToken" value={params.token} />

          <div className="w-full space-y-8">
            <div>
              <Input
                placeholder="New Password"
                className={`rounded-sm ${
                  state?.errors?.password ? "border border-destructive" : ""
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
                className={`rounded-sm ${
                  state?.errors?.confirm_password
                    ? "border border-destructive"
                    : ""
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
                  <Loading
                    propColor={theme === "light" ? "white" : "black"}
                    propSize={20}
                  />
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
                  href="/auth/"
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
