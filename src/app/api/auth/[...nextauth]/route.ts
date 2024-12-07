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
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                const users = await prisma.$queryRaw<User[]>`
                    SELECT * FROM "User" WHERE email = ${credentials.email} LIMIT 1
                `;

                if (users.length === 0) {
                    return null;
                }

                const user = users[0];
                const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

                if (!isPasswordValid) {
                    return null;
                }

                return {
                    id: user.id.toString(),
                    email: user.email,
                    name: user.name,
                    role: user.role,
                };
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
                    const existingUsers = await prisma.$queryRaw<User[]>`
                        SELECT * FROM "User" WHERE email = ${email} LIMIT 1
                    `;

                    if (existingUsers.length === 0) {
                        await prisma.$executeRaw`
                            INSERT INTO "User" (name, email, password, role, "createdAt", "updatedAt")
                            VALUES (${name}, ${email}, ${hashedPassword}, 'customer', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
                        `;
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
                const dbUsers = await prisma.$queryRaw<User[]>`
                    SELECT * FROM "User" WHERE email = ${user.email} LIMIT 1
                `;

                if (dbUsers.length > 0) {
                    const dbUser = dbUsers[0];
                    token.id = dbUser.id;
                    token.name = dbUser.name;
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
                session.user.name = token.name as string;
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