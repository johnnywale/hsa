import Image from "next/image"

import { SidebarInset, SidebarProvider } from "@/registry/new-york-v4/ui/sidebar"
import { ChartAreaInteractive } from "@/app/(app)/admin/dashboard/components/chart-area-interactive"
import { DataTable } from "@/app/(app)/admin/dashboard/components/data-table"
import { SectionCards } from "@/app/(app)/admin/dashboard/components/section-cards"
import { SiteHeader } from "@/app/(app)/admin/dashboard/components/site-header"

import data from "./data.json"
import { ProtectedRoute } from "@/app/(app)/admin/components/protected-route"

export default function Page() {
  return (
    <>
      <ProtectedRoute>
        {/*<div className="md:hidden">*/}
        {/*  <Image*/}
        {/*    src="/admin/dashboard-light.png"*/}
        {/*    width={1280}*/}
        {/*    height={843}*/}
        {/*    alt="Authentication"*/}
        {/*    className="block dark:hidden"*/}
        {/*    priority*/}
        {/*  />*/}
        {/*  <Image*/}
        {/*    src="/admin/dashboard-dark.png"*/}
        {/*    width={1280}*/}
        {/*    height={843}*/}
        {/*    alt="Authentication"*/}
        {/*    className="hidden dark:block"*/}
        {/*    priority*/}
        {/*  />*/}
        {/*</div>*/}
        <SidebarProvider
          className="flex"
          style={
            {
              "--sidebar-width": "calc(var(--spacing) * 64)",
              "--header-height": "calc(var(--spacing) * 12 + 1px)",
            } as React.CSSProperties
          }
        >
          {/*<AppSidebar variant="sidebar" />*/}
          <SidebarInset>
            <SiteHeader />
            <div className="flex flex-1 flex-col">
              <div className="@container/main flex flex-1 flex-col gap-2">
                <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                  <SectionCards />
                  <div className="px-4 lg:px-6">
                    <ChartAreaInteractive />
                  </div>
                  <DataTable data={data} />
                </div>
              </div>
            </div>
          </SidebarInset>
        </SidebarProvider>
      </ProtectedRoute>
    </>
  )
}
