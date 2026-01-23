"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import {
  ActivityIcon,
  BotIcon,
  ChevronsUpDownIcon,
  ClipboardPlusIcon,
  LogOutIcon,
  MessageCircleIcon,
  PlusIcon,
  SearchIcon,
  SettingsIcon,
  TableOfContentsIcon,
  UsersIcon,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import type { Route } from "next";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SelectChats } from "@/db/schema/chat";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type SidebarLink = {
  href: Route;
  label: string;
  icon: LucideIcon;
};

const sidebarLinks: readonly SidebarLink[] = [
  {
    href: "/playground",
    label: "Overview",
    icon: TableOfContentsIcon,
  },
  {
    href: "/playground/chat",
    label: "Chats",
    icon: MessageCircleIcon,
  },
  {
    href: "/playground/activity",
    label: "Activity",
    icon: ActivityIcon,
  },
  {
    href: "/playground/health-report",
    label: "Health Reports",
    icon: ClipboardPlusIcon,
  },
] as const;

export default function PlaySidebar({ chats }: { chats: Array<SelectChats> }) {
  const { state } = useSidebar();
  const router = useRouter();
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center justify-between">
            {isCollapsed ? <SidebarTrigger /> : <BotIcon />}
            {!isCollapsed && (
              <>
                <h1 className="text-lg md:text-2xl font-bold">
                  <Link href="/">PashuCare AI</Link>
                </h1>
                <SidebarTrigger />
              </>
            )}
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {/* quick actions */}
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                type="button"
                onClick={() => router.push("/playground/chat")}
              >
                <PlusIcon />
                New chat
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                type="button"
                onClick={() => toast.warning("Coming soon!")}
              >
                <SearchIcon />
                Search chat
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
        {/* quick links */}
        <SidebarGroup>
          <SidebarGroupLabel>Quick links</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              {sidebarLinks.map((item) => (
                <SidebarMenuButton key={item.label} asChild>
                  <Link href={item.href}>
                    <item.icon />

                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              ))}
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
        {/* chats */}
        {/* TODO: hide message when sidebar is collapsed */}
        {!isCollapsed && (
          <SidebarGroup>
            <SidebarGroup>
              <SidebarGroupLabel>Your chats</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    {chats?.map((chat) => (
                      <p className="text-sm" key={chat.id}>
                        {chat.title}
                      </p>
                    ))}
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarGroup>
        )}
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <Avatar>
                    <AvatarImage
                      src="https://ui-avatars.com/api/?name=Anon"
                      alt="user"
                    />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                  <p>Anon</p>
                  <ChevronsUpDownIcon className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>
                  <UsersIcon />
                  <span>Account</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <SettingsIcon />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <LogOutIcon className="text-destructive" />
                  <span className="text-destructive">Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
