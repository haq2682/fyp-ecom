import { PrismaClient } from '@prisma/client';
import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { User, Role } from '@prisma/client';
import NextAuth from 'next-auth';

const prisma = new PrismaClient();

const client: string = process.env.GOOGLE_ID as string;
const secret: string = process.env.GOOGLE_SECRET as string;

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: client,
            clientSecret: secret,
        }),
    ],
    callbacks: {
        async signIn({ user, account }) {
            if (account?.provider === 'google') {
                const { email, name } = user;

                try {
                    const existingUser = await prisma.$queryRaw<User[]>`SELECT * FROM "User" WHERE email = ${email}`;

                    if (existingUser.length === 0) {
                        await prisma.$executeRaw`INSERT INTO "User" (username, email, password, role, "createdAt", "updatedAt") VALUES (${name}, ${email}, '', 'customer', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`;
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