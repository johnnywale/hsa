import {SidebarInset, SidebarProvider,} from "@/registry/new-york-v4/ui/sidebar"
import {AppSidebar} from "@/app/(app)/admin/components/app-sidebar"
import {SiteHeader} from "@/app/(app)/admin/components/site-header"

import "@/app/(app)/admin/theme.css"

export default async function DashboardLayout({
                                                  children,
                                              }: {
    children: React.ReactNode
}) {
    // const cookieStore = await cookies()
    const defaultOpen = true

    return (
        <SidebarProvider
            defaultOpen={defaultOpen}
            style={
                {
                    "--sidebar-width": "calc(var(--spacing) * 72)",
                } as React.CSSProperties
            }
        >
            <AppSidebar variant="inset"/>
            <SidebarInset>
                <SiteHeader/>
                <div className="flex flex-1 flex-col">{children}</div>
            </SidebarInset>
        </SidebarProvider>
    )
}
