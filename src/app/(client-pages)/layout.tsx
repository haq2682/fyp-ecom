import Navbar from "@/components/ui/navbar";
import Footer from "@/components/ui/footer";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/client-app-sidebar";

export default function ClientPagesLayout({ children }: { children: Readonly<React.ReactNode> }) {
    return (
        <>
            <SidebarProvider defaultOpen={false}>
                <AppSidebar />
                <SidebarInset>
                    <Navbar />
                    {children}
                    <Footer />
                </SidebarInset>
            </SidebarProvider>
        </>
    )
}