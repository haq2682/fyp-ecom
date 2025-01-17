import { DefaultSession, DefaultJWT } from "next-auth"
import { User } from "@prisma/client"

declare module "next-auth" {
    interface Session extends DefaultSession {
        user: User
    }
}

declare module "next-auth/jwt" {
    interface JWT extends DefaultJWT, Omit<User, "id"> {
        id: number
    }
}

