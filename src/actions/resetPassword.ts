/*"use server"

import * as z from "zod"
import storefront from "@/utils/shopify"

const resetPasswordSchema = z
  .object({
    password: z.string().min(8, { message: "Password must contain at least 8 characters" }),
    confirm_password: z.string().min(8, { message: "Confirm Password must contain at least 8 characters" }),
    resetToken: z.string(),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  })

interface ResetPasswordFormState {
  status: string
  message: string
  errors?: {
    password?: string[]
    confirm_password?: string[]
  }
}

const CUSTOMER_RESET_MUTATION = `
  mutation customerReset($id: ID!, $input: CustomerResetInput!) {
    customerReset(id: $id, input: $input) {
      customerAccessToken {
        accessToken
        expiresAt
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`

export async function resetPassword(
  previousState: ResetPasswordFormState,
  formData: FormData,
): Promise<ResetPasswordFormState> {
  try {
    const password = formData.get("password") as string
    const confirm_password = formData.get("confirm_password") as string
    const resetToken = formData.get("resetToken") as string

    const result = resetPasswordSchema.safeParse({
      password,
      confirm_password,
      resetToken,
    })

    if (!result.success) {
      return {
        status: "error",
        message: "Invalid input",
        errors: result.error.flatten().fieldErrors,
      }
    }

    const response = await storefront(CUSTOMER_RESET_MUTATION, {
      id: resetToken,
      input: {
        password,
        resetToken,
      },
    })

    const { customerReset } = response.data

    if (customerReset.customerUserErrors.length > 0) {
      const error = customerReset.customerUserErrors[0]
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
      message: "Password reset successful. You can now login with your new password.",
    }
  } catch (error) {
    console.error("Reset password error:", error)
    return {
      status: "error",
      message: "An unexpected error occurred",
    }
  }
}

*/
"use server"

import * as z from "zod"
import storefront from "@/utils/shopify"

const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, { message: "Password must contain at least 8 characters" }),
    confirm_password: z
      .string()
      .min(8, { message: "Confirm Password must contain at least 8 characters" }),
    resetToken: z.string(),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  })

interface ResetPasswordFormState {
  status: string
  message: string
  errors?: {
    password?: string[]
    confirm_password?: string[]
    _form?: string[]
  }
}

const CUSTOMER_RESET_MUTATION = `
  mutation customerResetByToken($input: CustomerResetByTokenInput!) {
    customerResetByToken(input: $input) {
      customer {
        id
        email
      }
      customerUserErrors {
        field
        message
      }
    }
  }
`

export async function resetPassword(
  previousState: ResetPasswordFormState,
  formData: FormData
): Promise<ResetPasswordFormState> {
  try {
    const password = formData.get("password") as string
    const confirm_password = formData.get("confirm_password") as string
    const resetToken = formData.get("resetToken") as string

    // Validate input
    const validationResult = resetPasswordSchema.safeParse({
      password,
      confirm_password,
      resetToken,
    })

    if (!validationResult.success) {
      return {
        status: "error",
        message: "Validation failed",
        errors: validationResult.error.flatten().fieldErrors,
      }
    }

    // Call Shopify API
    const response = await storefront(CUSTOMER_RESET_MUTATION, {
      input: {
        resetToken,
        password,
      },
    })

    const { customerResetByToken } = response.data

    // Handle user errors from Shopify
    if (
      customerResetByToken.customerUserErrors &&
      customerResetByToken.customerUserErrors.length > 0
    ) {
      const error = customerResetByToken.customerUserErrors[0]
      return {
        status: "error",
        message: error.message,
        errors: {
          [error.field?.[0] || "_form"]: [error.message],
        },
      }
    }

    // Password reset successful
    return {
      status: "success",
      message: "Password reset successful. You can now login with your new password.",
    }
  } catch (error) {
    console.error("Reset password error:", error)
    return {
      status: "error",
      message: "An unexpected error occurred. Please try again.",
      errors: {
        _form: ["An unexpected error occurred. Please try again."],
      },
    }
  }
}
