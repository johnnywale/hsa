"use client"

import * as React from "react"
import {
  IconDashboard,
  IconDatabase,
  IconFileDescription,
  IconFileWord,
  IconHelp,
  IconInnerShadowTop,
  IconListDetails, IconPlayCard,
  IconReport,
  IconSearch,
  IconSettings,
  IconUsers,
} from "@tabler/icons-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/registry/new-york-v4/ui/sidebar"
import { NavDocuments } from "@/app/(app)/admin/components/nav-documents"
import { NavMain } from "@/app/(app)/admin/components/nav-main"
import { NavAccess } from "@/app/(app)/admin/components/nav-access"
import { NavSecondary } from "@/app/(app)/admin/components/nav-secondary"
import { NavUser } from "@/app/(app)/admin/components/nav-user"

const data = {
  user: {
    name: "yihua",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    { title: "Dashboard", url: "/admin/dashboard", icon: IconDashboard },
  ],
  documents: [
    { name: "Models", url: "/admin/llm/models", icon: IconFileWord },
    { name: "Presets", url: "/admin/llm/presets", icon: IconFileDescription },
    { name: "Chat Histories", url: "/admin/llm/chat-histories", icon: IconReport },
    { name: "Documents", url: "/admin/llm/documents", icon: IconDatabase },
    { name: "Chunks", url: "/admin/llm/chunks", icon: IconReport },
    { name: "Embeddings", url: "/admin/llm/embeddings", icon: IconReport },
    { name: "Ingestion Jobs", url: "/admin/llm/ingestion-jobs", icon: IconListDetails },
    { name: "Ingestion Steps", url: "/admin/llm/ingestion-steps", icon: IconListDetails },
    { name: "Queries", url: "/admin/llm/queries", icon: IconListDetails },
    { name: "Query Chunk Matches", url: "/admin/llm/query-chunk-matches", icon: IconListDetails },
    { name: "Play Ground", url: "/admin/llm/playground", icon: IconPlayCard },
  ],
  access: [
    { title: "Users", url: "/admin/access/users", icon: IconUsers },
    { title: "Roles", url: "/admin/access/roles", icon: IconListDetails },
    { title: "Audit Logs", url: "/admin/access/audit-logs", icon: IconListDetails },
  ],
  navSecondary: [
    { title: "Settings", url: "#", icon: IconSettings },
    { title: "Get Help", url: "#", icon: IconHelp },
    { title: "Search", url: "#", icon: IconSearch },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">Accenture.</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavDocuments items={data.documents} />
        <NavAccess items={data.access} />

        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
