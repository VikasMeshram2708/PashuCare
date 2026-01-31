"use client";

import { LogoFn } from "@/components/header";

import {
  Sidebar,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import SidePanelQuickActions from "./sp-quick-actions";

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
            <div className="flex items-center justify-between">
              <LogoFn className="lg:w-36" />
              <SidebarTrigger className="cursor-pointer text-primary" />
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidePanelQuickActions isCollapsed={isCollapsed} />
      </SidebarHeader>
    </Sidebar>
  );
}
