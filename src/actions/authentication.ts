'use server'

import prisma from '@/db';
import { User } from '@prisma/client';
import * as z from 'zod';
import bcrypt from 'bcrypt';
import { signIn } from 'next-auth/react';
import { redirect } from 'next/navigation';

const userLoginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
});

const nameMessage = "Name must contain at least 8 characters and at most 15 characters";

const userRegisterSchema = z.object({
    name: z.string().min(8, {message: nameMessage}).max(15, {message: nameMessage}),
    email: z.string().email({message: "E-Mail is Invalid"}),
    password: z.string().min(8, { message: "Password must contain at least 8 characters" }),
    confirm_password: z.string().min(8, { message: "Confirm Password must contain at least 8 characters" })
})
    .refine((data) => data.password === data.confirm_password, {
        message: "Passwords do not match",
        path: ["confirm_password"]
    })

interface LoginFormState {
    status: string;
    message: string;
    errors?: {
        email?: string[];
        password?: string[];
    }
};

interface RegisterFormState extends LoginFormState {
    errors?: {
        email?: string[];
        password?: string[];
        name?: string[];
        confirm_password?: string[];
    };
}

export async function login(previousState: LoginFormState, formData: FormData): Promise<LoginFormState> {
    try {
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        const result = userLoginSchema.safeParse({ email, password });

        if (!result.success) {
            return {
                status: 'error',
                message: result.error.message,
                errors: result.error.flatten().fieldErrors
            };
        }

        const signInResult = await signIn('credentials', {
            redirect: true,
            email,
            password,
        });

        if (signInResult?.error) {
            return {
                status: 'error',
                message: 'Invalid credentials',
                errors: {
                    email: ['Invalid email or password'],
                    password: ['Invalid email or password'],
                }
            };
        }

        return {
            status: 'success',
            message: 'Login Successful'
        };
    }
    catch (error) {
        console.error('Login error:', error);
        return {
            status: 'error',
            message: 'An unexpected error occurred'
        };
    }
}

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

        const existingUsers = await prisma.$queryRaw<User[]>`
            SELECT * FROM "User" WHERE email = ${email} LIMIT 1
        `;

        if (existingUsers.length > 0) {
            return {
                status: 'error',
                message: 'User already exists',
                errors: {
                    email: ['An account with this email already exists'],
                }
            }
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await prisma.$executeRaw`
            INSERT INTO "User" (name, email, password, role, "createdAt", "updatedAt")
            VALUES (${name}, ${email}, ${hashedPassword}, 'customer', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        `;

        redirect('/home');
    } catch (error) {
        console.error('Registration error:', error);
        return {
            status: 'error',
            message: 'An unexpected error occurred'
        };
    }
}


