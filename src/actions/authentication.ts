'use server'

import * as z from 'zod';
import { signIn } from 'next-auth/react';
import { redirect } from 'next/navigation';
import storefront from '@/utils/shopify';

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

interface LoginFormState {
    status: string;
    message: string;
    errors?: {
        email?: string[];
        password?: string[];
    }
}

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

        const result = userLoginSchema.safeParse({ email, password });

        if (!result.success) {
            return {
                status: 'error',
                message: 'Invalid Credentials',
                errors: result.error.flatten().fieldErrors
            };
        }
        try {
            const response = await storefront(CUSTOMER_ACCESS_TOKEN_CREATE, {
                input: {
                    email,
                    password
                }
            });

            const { customerAccessTokenCreate } = response.data;

            if (customerAccessTokenCreate.customerUserErrors.length > 0) {
                // const error = customerAccessTokenCreate.customerUserErrors[0];
                return {
                    status: 'error',
                    message: 'Invalid credentials',
                    errors: {
                        email: ['Invalid email or password'],
                        password: ['Invalid email or password']
                    }
                };
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