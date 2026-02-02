"use client";

import { LogoFn } from "@/components/header";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import SidePanelQuickActions from "./sp-quick-actions";
import ChatsList from "./chats-list";

import { ClipboardPlusIcon, LayoutDashboardIcon } from "lucide-react";
import UserBtnClient from "./user-btn-client";
import Link from "next/link";
import { Suspense } from "react";

export default function ChatSidePanel() {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";
  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-primary backdrop-blur-lg shadow-lg"
    >
      <SidebarHeader>
        <SidebarGroup>
          <SidebarGroupContent>
            <div
              className={
                isCollapsed
                  ? "flex items-center justify-center"
                  : "flex items-center justify-between"
              }
            >
              {!isCollapsed && (
                <Link href="/">
                  <LogoFn className="lg:w-36" />
                </Link>
              )}
              <SidebarTrigger className="cursor-pointer text-primary" />
            </div>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidePanelQuickActions isCollapsed={isCollapsed} />
      </SidebarHeader>

      <SidebarContent className="flex min-h-0 flex-col">
        {/* Links */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-primary">Links</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/chat/dashboard" prefetch>
                    <LayoutDashboardIcon />
                    Dashboard
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/chat/reports" prefetch>
                    <ClipboardPlusIcon />
                    Reports Check
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Chats */}
        {!isCollapsed && (
          <SidebarGroup className="flex min-h-0 flex-col">
            <SidebarGroupLabel className="text-primary">
              Your chats
            </SidebarGroupLabel>

            <SidebarGroupContent className="min-h-0 flex-1 overflow-y-auto">
              <Suspense fallback={<p>Loading chats...</p>}>
                <ChatsList />
              </Suspense>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
      {/* Footer */}
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center justify-center">
            <UserBtnClient />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
