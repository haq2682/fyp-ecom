'use server'

import * as z from 'zod';
import { signIn } from 'next-auth/react';
import { redirect } from 'next/navigation';
import storefront from '@/utils/shopify';
import type { LoginFormState, LoginAction } from '@/types';
import { cookies } from 'next/headers';

const nameMessage = "Name must contain at least 8 characters and at most 15 characters";

const userRegisterSchema = z.object({
  name: z.string().min(8, { message: nameMessage }).max(15, { message: nameMessage }),
  email: z.string().email({ message: "E-Mail is Invalid" }),
  password: z.string().min(8, { message: "Password must contain at least 8 characters" }),
  confirm_password: z.string().min(8, { message: "Confirm Password must contain at least 8 characters" })
})
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"]
  });

const userLoginSchema = z.object({
  email: z.string().email({ message: "E-Mail is Invalid" }),
  password: z.string().min(8, { message: "Password must contain at least 8 characters" }),
});

interface RegisterFormState {
  status: string;
  message: string;
  errors?: {
    email?: string[];
    password?: string[];
    name?: string[];
    confirm_password?: string[];
  };
}

// interface LoginFormState {
//   status: string;
//   message: string;
//   errors?: {
//     email?: string[];
//     password?: string[];
//   }
// }

const CREATE_CUSTOMER_MUTATION = `
  mutation customerCreate($input: CustomerCreateInput!) {
    customerCreate(input: $input) {
      customer {
        id
        email
        firstName
        lastName
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`;

const CUSTOMER_ACCESS_TOKEN_CREATE = `
  mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
    customerAccessTokenCreate(input: $input) {
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
`;

export async function register(previousState: RegisterFormState, formData: FormData): Promise<RegisterFormState> {
  try {
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const confirm_password = formData.get('confirm_password') as string;

    const result = userRegisterSchema.safeParse({ name, email, password, confirm_password });

    if (!result.success) {
      return {
        status: 'error',
        message: 'Invalid Credentials',
        errors: result.error.flatten().fieldErrors
      }
    }

    const nameParts = name.trim().split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    const createCustomerResponse = await storefront(CREATE_CUSTOMER_MUTATION, {
      input: {
        email,
        password,
        firstName,
        lastName,
        acceptsMarketing: false
      }
    });

    const { customerCreate } = createCustomerResponse.data;

    if (customerCreate.customerUserErrors.length > 0) {
      const error = customerCreate.customerUserErrors[0];
      return {
        status: 'error',
        message: error.message,
        errors: {
          [error.field]: [error.message]
        }
      };
    }
    const tokenResponse = await storefront(CUSTOMER_ACCESS_TOKEN_CREATE, {
      input: {
        email,
        password
      }
    });

    const { customerAccessTokenCreate } = tokenResponse.data;

    if (customerAccessTokenCreate.customerUserErrors.length > 0) {
      const error = customerAccessTokenCreate.customerUserErrors[0];
      return {
        status: 'error',
        message: error.message,
        errors: {
          [error.field]: [error.message]
        }
      };
    }

    const signInResult = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    if (signInResult?.error) {
      return {
        status: 'error',
        message: 'Unable to sign in after registration',
        errors: {
          email: ['Authentication failed after registration'],
        }
      };
    }

    redirect(`${process.env.SHOPIFY_STORE_DOMAIN}/home`);
  } catch (error) {
    console.error('Registration error:', error);
    return {
      status: 'error',
      message: 'An unexpected error occurred during registration'
    };
  }
}

export async function login(previousState: LoginFormState, formData: FormData): Promise<LoginFormState> {
  try {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const checkoutUrl = formData.get('checkoutUrl') as string;

    const result = userLoginSchema.safeParse({ email, password });

    if (!result.success) {
      return {
        status: 'error',
        message: 'Invalid Credentials',
        errors: result.error.flatten().fieldErrors
      };
    }

    try {
      // Authenticate with Shopify
      const response = await storefront(CUSTOMER_ACCESS_TOKEN_CREATE, {
        input: {
          email,
          password
        }
      });

      const { customerAccessTokenCreate } = response.data;

      if (customerAccessTokenCreate.customerUserErrors.length > 0) {
        return {
          status: 'error',
          message: 'Invalid credentials',
          errors: {
            email: ['Invalid email or password'],
            password: ['Invalid email or password']
          }
        };
      }

      // Get the access token
      const accessToken = customerAccessTokenCreate.customerAccessToken.accessToken;

      // Set the access token in a cookie
      (await
        // Set the access token in a cookie
        cookies()).set('shopifyCustomerAccessToken', accessToken, {
          secure: true,
          httpOnly: true,
          sameSite: 'lax',
          path: '/',
        });

      // If we have a checkout URL, redirect to Shopify's checkout
      if (checkoutUrl) {
        const decodedUrl = decodeURIComponent(checkoutUrl);
        const shopifyDomain = 'https://university-fyp.myshopify.com';
        const separator = decodedUrl.includes('?') ? '&' : '?';
        redirect(`${shopifyDomain}${decodedUrl}${separator}access_token=${accessToken}`);
      }

      return {
        status: 'success',
        message: 'Login Successful',
      };

    } catch (error) {
      console.error('Login error:', error);
      return {
        status: 'error',
        message: 'An unexpected error occurred',
        errors: {
          email: ['An unexpected error occurred'],
          password: ['An unexpected error occurred']
        }
      };
    }
  } catch (error) {
    console.error('Login error:', error);
    return {
      status: 'error',
      message: 'An unexpected error occurred'
    };
  }
}

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
    _form?: string[]
  }
}

const CUSTOMER_RESET_MUTATION = `
  mutation customerReset($id: ID!, $input: CustomerResetInput!) {
    customerReset(id: $id, input: $input) {
      customer {
        id
        email
      }
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

    // The resetToken from Shopify contains both the customer ID and token
    // Format: customerId/resetToken
    const [customerId, token] = resetToken.split('/')

    if (!customerId || !token) {
      return {
        status: "error",
        message: "Invalid reset token format",
        errors: {
          _form: ["Invalid or expired reset link"]
        }
      }
    }

    const response = await storefront(CUSTOMER_RESET_MUTATION, {
      id: `gid://shopify/Customer/${customerId}`,
      input: {
        password,
        resetToken: token  // Use only the token part
      },
    })

    const { customerReset } = response.data

    if (customerReset.customerUserErrors?.length > 0) {
      const error = customerReset.customerUserErrors[0]
      if (error.code === "TOKEN_INVALID" || error.code === "EXPIRED") {
        return {
          status: "error",
          message: "Reset password link is invalid or has expired",
          errors: {
            _form: ["Reset password link is invalid or has expired"]
          }
        }
      }
      return {
        status: "error",
        message: error.message,
        errors: {
          [error.field]: [error.message],
        }
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
      errors: {
        _form: ["An unexpected error occurred while resetting your password"]
      }
    }
  }
}
