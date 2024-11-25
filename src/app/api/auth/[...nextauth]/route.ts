import NextAuth, { NextAuthOptions, User } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { Url } from "next/dist/shared/lib/router/router";

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
        async signIn({ user }: { user: User }) {
            console.log(user);
            return true;
        },
        async redirect({ url, baseUrl }: { url: Url, baseUrl: string }) {
            return baseUrl;
        }
    },
    session: {
        strategy: 'jwt'
    }
}

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };