import { PrismaClient } from '@prisma/client';
import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from "next-auth/providers/credentials";
import { User, Role } from '@prisma/client';
import NextAuth from 'next-auth';
import crypto from 'crypto';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const client: string = process.env.GOOGLE_ID as string;
const secret: string = process.env.GOOGLE_SECRET as string;

function generateRandomString(length: number): string {
    return crypto.randomBytes(Math.ceil(length / 2))
        .toString('hex')
        .slice(0, length);
}

async function hashString(str: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(str, saltRounds);
}

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: client,
            clientSecret: secret,
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials, req) {
                // const user = await prisma.$queryRaw<User[]>`SELECT * FROM User WHERE email = ${credentials?.email}`;
                console.log(credentials);
                return null;
            }
        }),
    ],
    callbacks: {
        async signIn({ user, account }) {
            if (account?.provider === 'google') {
                const { email, name } = user;
                const password = generateRandomString(10);
                const hashedPassword = await hashString(password);

                try {
                    const existingUser = await prisma.$queryRaw<User[]>`SELECT * FROM "User" WHERE email = ${email}`;

                    if (existingUser.length === 0) {
                        await prisma.$executeRaw`INSERT INTO "User" (username, email, password, role, "createdAt", "updatedAt") VALUES (${name}, ${email}, ${hashedPassword}, 'customer', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`;
                    }

                    return true;
                } catch (error) {
                    console.error('Error during sign in:', error);
                    return false;
                }
            }
            return true;
        },
        async jwt({ token, user }) {
            if (user) {
                const dbUser = await prisma.user.findUnique({
                    where: { email: user.email as string },
                });

                if (dbUser) {
                    token.id = dbUser.id;
                    token.username = dbUser.username;
                    token.email = dbUser.email;
                    token.address = dbUser.address;
                    token.contact = dbUser.contact;
                    token.role = dbUser.role;
                    token.createdAt = dbUser.createdAt;
                    token.updatedAt = dbUser.updatedAt;
                }
            }
            return token;
        },
        async session({ session, token }) {
            if (token && session.user) {
                session.user.id = token.id as number;
                session.user.username = token.username as string;
                session.user.email = token.email as string;
                session.user.address = token.address as string | null;
                session.user.contact = token.contact as string | null;
                session.user.role = token.role as Role;
                session.user.createdAt = token.createdAt as Date;
                session.user.updatedAt = token.updatedAt as Date;
            }
            return session;
        },
        async redirect({ url, baseUrl }: { url: string, baseUrl: string }) {
            return baseUrl;
        }
    },
    session: {
        strategy: 'jwt'
    }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };