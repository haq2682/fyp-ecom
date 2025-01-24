"use server"

import * as z from "zod"
import storefront from "@/utils/shopify"

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "E-Mail is Invalid" }),
})

interface ForgotPasswordFormState {
  status: string
  message: string
  errors?: {
    email?: string[]
  }
}

const CUSTOMER_RECOVER_MUTATION = `
  mutation customerRecover($email: String!) {
    customerRecover(email: $email) {
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`

export async function forgotPassword(
  previousState: ForgotPasswordFormState,
  formData: FormData,
): Promise<ForgotPasswordFormState> {
  try {
    const email = formData.get("email") as string

    const result = forgotPasswordSchema.safeParse({ email })

    if (!result.success) {
      return {
        status: "error",
        message: "Invalid Email",
        errors: result.error.flatten().fieldErrors,
      }
    }

    const response = await storefront(CUSTOMER_RECOVER_MUTATION, {
      email,
    })

    const { customerRecover } = response.data

    if (customerRecover.customerUserErrors.length > 0) {
      const error = customerRecover.customerUserErrors[0]
      return {
        status: "error",
        message: error.message,
        errors: {
          [error.field]: [error.message],
        },
      }
    }

    return {
      status: "success",
      message: "If an account with that email exists, you will receive a password reset email shortly.",
    }
  } catch (error) {
    console.error("Forgot password error:", error)
    return {
      status: "error",
      message: "An unexpected error occurred",
    }
  }
}

