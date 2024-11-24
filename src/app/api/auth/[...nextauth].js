import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const client = process.env.GOOGLE_ID;
const secret = process.env.GOOGLE_SECRET;

export const authOptions = {
    providers: [
        GoogleProvider({
            clientId: client,
            clientSecret: secret
        }),
    ],
}

export default NextAuth(authOptions)