// app/chat/[id]/page.tsx
"use client";

import { useParams } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { Id } from "@/convex/_generated/dataModel";
import ActiveChatInput from "../components/active-chat-input";

export default function ChatIdPage() {
  const { id } = useParams();
  const { user } = useUser();

  const messagesQuery = useQuery(
    api.chats.getChatMessages,
    user?.id && id
      ? { chatId: id as Id<"chats">, userId: user.id, limit: 100 }
      : "skip",
  );

  const messages = messagesQuery?.page || [];

  // Check if we need to auto-trigger AI
  const lastMessage = messages[messages.length - 1];
  const needsAIResponse = lastMessage?.role === "user" && messages.length === 1;

  if (!user) return <div>Please sign in</div>;

  return (
    <div className="h-[calc(100vh-4rem)]">
      <ActiveChatInput
        id={id as Id<"chats">}
        userId={user.id}
        initialMessages={messages}
        autoTrigger={needsAIResponse}
      />
    </div>
  );
}
