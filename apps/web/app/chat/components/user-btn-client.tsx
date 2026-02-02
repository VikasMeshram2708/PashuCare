"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { SignOutButton, useUser } from "@clerk/nextjs";
import {
  ChevronsUpDownIcon,
  LogOutIcon,
  SettingsIcon,
  UsersIcon,
} from "lucide-react";

export default function UserBtnClient() {
  const { user } = useUser();
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton type="button">
              <Avatar>
                <AvatarImage
                  src={
                    user?.imageUrl ??
                    `https://ui-avatars.com/api/?name=${user?.fullName}`
                  }
                />
                <AvatarFallback>
                  {user?.fullName?.charAt(0) ?? "U"}
                </AvatarFallback>
              </Avatar>
              <p className="text-sm text-balance">
                {user?.firstName ?? user?.fullName ?? "Anon"}
              </p>
              <ChevronsUpDownIcon className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel className="text-primary">
              Action
            </DropdownMenuLabel>
            <DropdownMenuItem>
              <UsersIcon />
              Account
            </DropdownMenuItem>
            <DropdownMenuItem>
              <SettingsIcon />
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem>
              <LogOutIcon />
              <SignOutButton />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
