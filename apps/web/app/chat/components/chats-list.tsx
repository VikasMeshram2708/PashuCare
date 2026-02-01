/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import {
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  EllipsisVerticalIcon,
  SquarePenIcon,
  Trash2Icon,
  Loader2Icon,
  MessageSquareIcon,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Id } from "@/convex/_generated/dataModel";

export default function ChatsList() {
  const { user, isLoaded: isUserLoaded } = useUser();
  const [chatToDelete, setChatToDelete] = useState<string | null>(null);

  // Only fetch when user is loaded
  const chats = useQuery(
    api.chats.getUserChats,
    user?.id ? { userId: user.id, limit: 50 } : "skip",
  );

  const deleteChat = useMutation(api.chats.softDeleteChat);

  const handleDelete = async (chatId: string) => {
    if (!user?.id) return;

    try {
      await deleteChat({ chatId: chatId as Id<"chats">, userId: user.id });
      toast.success("Chat deleted");
    } catch (error) {
      toast.error("Failed to delete chat");
      console.error(error);
    } finally {
      setChatToDelete(null);
    }
  };

  const handleRename = (_chatId: string, _currentName: string) => {
    // TODO: Implement rename modal
    toast.warning("Rename coming soon!");
  };

  // Loading state
  if (!isUserLoaded) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2Icon className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // Not authenticated
  if (!user) {
    return (
      <div className="px-4 py-8 text-center text-sm text-muted-foreground">
        Sign in to view your chats
      </div>
    );
  }

  // Loading chats
  if (chats === undefined) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2Icon className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // Empty state
  if (chats.page.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
        <MessageSquareIcon className="h-8 w-8 text-muted-foreground/50 mb-2" />
        <p className="text-sm text-muted-foreground">No chats yet</p>
        <p className="text-xs text-muted-foreground/70 mt-1">
          Start a new conversation
        </p>
      </div>
    );
  }

  return (
    <>
      <SidebarMenu className="px-2">
        {chats.page.map((chat) => (
          <SidebarMenuItem key={chat._id}>
            <SidebarMenuButton asChild className="group/primitive">
              <Link href={`/chat/${chat._id}`} prefetch={false}>
                <span className="truncate">{chat.name || "Untitled Chat"}</span>
              </Link>
            </SidebarMenuButton>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuAction
                  showOnHover
                  className="data-[state=open]:bg-sidebar-accent"
                >
                  <EllipsisVerticalIcon className="h-4 w-4" />
                  <span className="sr-only">More options</span>
                </SidebarMenuAction>
              </DropdownMenuTrigger>

              <DropdownMenuContent side="right" align="start" className="w-40">
                <DropdownMenuLabel className="text-xs text-muted-foreground">
                  Actions
                </DropdownMenuLabel>

                <DropdownMenuItem
                  onClick={() => handleRename(chat._id, chat.name)}
                >
                  <SquarePenIcon className="mr-2 h-4 w-4" />
                  Rename
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => setChatToDelete(chat._id)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2Icon className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>

      {/* Delete Confirmation */}
      <AlertDialog
        open={!!chatToDelete}
        onOpenChange={() => setChatToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Chat?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this conversation. This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => chatToDelete && handleDelete(chatToDelete)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
