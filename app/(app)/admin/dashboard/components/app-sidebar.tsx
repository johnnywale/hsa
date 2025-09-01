"use client"

import * as React from "react"
import Link from "next/link"
import {
  IconCamera,
  IconDashboard,
  IconDatabase,
  IconFileAi,
  IconFileDescription,
  IconFileWord,
  IconHelp,
  IconInnerShadowTop,
  IconListDetails,
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
import { NavDocuments } from "@/app/(app)/admin/dashboard/components/nav-documents"
import { NavMain } from "@/app/(app)/admin/dashboard/components/nav-main"
import { NavSecondary } from "@/app/(app)/admin/dashboard/components/nav-secondary"
import { NavUser } from "@/app/(app)/admin/dashboard/components/nav-user"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [

    { title: "Dashboard", url: "/dashboard", icon: IconDashboard },
    { title: "Models", url: "/models", icon: IconFileWord },
    { title: "Presets", url: "/presets", icon: IconFileDescription },
    { title: "Chat Histories", url: "/chat-histories", icon: IconReport },
  ],
  navClouds: [
    {
      title: "Capture",
      icon: IconCamera,
      isActive: true,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Proposal",
      icon: IconFileDescription,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Prompts",
      icon: IconFileAi,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: IconSettings,
    },
    {
      title: "Get Help",
      url: "#",
      icon: IconHelp,
    },
    {
      title: "Search",
      url: "#",
      icon: IconSearch,
    },
  ],
  documents: [
    { name: "Documents", url: "/documents", icon: IconDatabase },
    { name: "Chunks", url: "/chunks", icon: IconReport },
    { name: "Embeddings", url: "/embeddings", icon: IconReport },
    { name: "Ingestion Jobs", url: "/ingestion-jobs", icon: IconListDetails },
    { name: "Ingestion Steps", url: "/ingestion-steps", icon: IconListDetails },
    { name: "Queries", url: "/queries", icon: IconListDetails },
    { name: "Query Chunk Matches", url: "/query-chunk-matches", icon: IconListDetails },

  ],
  admin: [
    { title: "Users", url: "/users", icon: IconUsers },
    { title: "Roles", url: "/roles", icon: IconListDetails },
    { title: "Audit Logs", url: "/audit-logs", icon: IconListDetails },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="none"
        className="hidden md:flex  h-auto border-r" {...props}>
      <SidebarHeader className="border-b">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link href="#">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">Accenture.</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavDocuments items={data.documents} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
