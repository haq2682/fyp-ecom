import DashboardSidebar from "@/components/dashboard-sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import DashboardNavbar from "@/components/ui/dashboard-navbar";
import { Suspense } from "react";
import Loading from "@/components/ui/loading";

export default function DashboardLayout({ children }: { children: Readonly<React.ReactNode> }) {
    return (
        <>
            <SidebarProvider defaultOpen>
                <DashboardSidebar />
                <SidebarInset>
                    <DashboardNavbar />
                    <Suspense fallback={<div>Loading...</div>}>
                        {children}
                    </Suspense>
                </SidebarInset>
            </SidebarProvider>
        </>
    )
}