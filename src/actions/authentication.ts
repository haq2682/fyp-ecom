'use server'

import prisma from '@/db';
import { User } from '@prisma/client';
import * as z from 'zod';
import bcrypt from 'bcrypt';
import { signIn } from 'next-auth/react';

const userLoginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
});

type LoginFormState = {
    status: string;
    message: string;
    errors?: {
        email?: string[];
        password?: string[];
    }
};

export async function login(previousState: LoginFormState, formData: FormData): Promise<LoginFormState> {
    try {
        const email = formData.get('email');
        const password = formData.get('password');

        const result = userLoginSchema.safeParse({ email, password });

        if (!result.success) {
            return {
                status: 'error',
                message: result.error.message,
                errors: result.error.flatten().fieldErrors
            };
        }

        const emailResult = await prisma.$queryRaw<User[]>`SELECT email, password FROM User WHERE email = ${email} LIMIT 1`;

        if (emailResult.length === 0) {
            return {
                status: 'not_found',
                message: 'Invalid Credentials',
                errors: {
                    email: ['An account with this email does not exist. Please register first.'],
                }
            }
        }

        const hashCheck = await bcrypt.compare(password as string, emailResult[0].password);

        if (hashCheck) {
            signIn('credentials');
        }
        else return {
            status: 'error',
            message: 'Invalid Credentials',
            errors: {
                password: ['Invalid Password']
            }
        }
        return {
            status: 'success',
            message: 'Login Successful'
        };
    }
    catch (error) {
        if (error instanceof z.ZodError) {
            return {
                status: 'error',
                message: error.message,
                errors: error.flatten().fieldErrors
            };
        }
        return {
            status: 'error',
            message: 'An unexpected error occurred'
        };
    }
}

