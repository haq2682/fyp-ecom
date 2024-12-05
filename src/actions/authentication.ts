'use server'

import * as z from 'zod';

const userLoginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
});

type LoginFormState = {
    message: string;
};

export async function login(previousState: LoginFormState, formData: FormData): Promise<LoginFormState> {
    try {
        const email = formData.get('email');
        const password = formData.get('password');

        const result = userLoginSchema.safeParse({ email, password });

        if (!result.success) {
            return {
                message: result.error.errors[0].message
            };
        }

        // Here you would typically handle the actual login logic
        // For now, we'll just return a success message
        return {
            message: 'Login successful'
        };
    }
    catch (error) {
        if (error instanceof z.ZodError) {
            return {
                message: error.errors[0].message
            };
        }
        // Handle any other types of errors
        return {
            message: 'An unexpected error occurred'
        };
    }
}

