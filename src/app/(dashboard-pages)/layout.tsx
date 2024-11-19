import DashboardSidebar from "@/components/dashboard-sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import DashboardNavbar from "@/components/ui/dashboard-navbar";

export default function DashboardLayout({ children }: { children: Readonly<React.ReactNode> }) {
    return (
        <>
            <SidebarProvider defaultOpen>
                <DashboardSidebar />
                <SidebarInset>
                    <DashboardNavbar />
                    {children}
                </SidebarInset>
            </SidebarProvider>
        </>
    )
}