import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"

export default function AuthLayout() {
    const {status} = useSession()
    if(status === 'authenticated') redirect('/');
}