import { NextAuthOptions, Session, User } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from "next-auth/providers/credentials";
import crypto from 'crypto';
import storefront from '@/utils/shopify';

// Define custom types
interface CustomUser extends User {
    accessToken?: string;
}

interface CustomSession extends Session {
    accessToken?: string;
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

function generateRandomString(length: number): string {
    return crypto.randomBytes(Math.ceil(length / 2))
        .toString('hex')
        .slice(0, length);
}

export const authOptions: NextAuthOptions = {
    // useSecureCookies: true,
    cookies: {
        sessionToken: {
            // name: `__Secure-next-auth.session-token`,
            options: {
                httpOnly: true,
                sameSite: 'lax',
                path: '/',
                secure: true
            }
        }
    },
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_ID as string,
            clientSecret: process.env.GOOGLE_SECRET as string,
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

                try {
                    const response = await storefront(CUSTOMER_ACCESS_TOKEN_CREATE, {
                        input: {
                            email: credentials.email,
                            password: credentials.password
                        }
                    });

                    const { customerAccessTokenCreate } = response.data;

                    if (customerAccessTokenCreate.customerUserErrors.length > 0) {
                        return null;
                    }

                    const accessToken = customerAccessTokenCreate.customerAccessToken.accessToken;

                    return {
                        id: accessToken,
                        email: credentials.email,
                        accessToken
                    };
                } catch (error) {
                    console.error('Authorization error:', error);
                    return null;
                }
            }
        }),
    ],
    callbacks: {
        async signIn({ user, account }) {
            if (account?.provider === 'google') {
                const { email, name } = user;
                const password = generateRandomString(10);

                try {
                    const nameParts = (name || '').split(' ');
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
                        if (error.code === 'CUSTOMER_DISABLED' || error.code === 'UNIDENTIFIED_CUSTOMER') {
                            return false;
                        }
                    }

                    return true;
                } catch (error) {
                    console.error('Error during Google sign in:', error);
                    return false;
                }
            }
            return true;
        },
        async jwt({ token, user, account }) {
            if (user && account?.provider === 'credentials') {
                token.accessToken = (user as CustomUser).accessToken;
            }
            return token;
        },
        async session({ session, token }: { session: CustomSession; token: JWT }) {
            if (token) {
                session.accessToken = token.accessToken as string;
            }
            return session;
        },
        async redirect({ url, baseUrl }) {
            if (url.startsWith(baseUrl)) {
                return url;
            }
            return baseUrl;
        }
    },
    pages: {
        signIn: `${process.env.SHOPIFY_STORE_DOMAIN}/account/login`,
    },
    session: {
        strategy: 'jwt'
    }
};