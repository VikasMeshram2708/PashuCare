"use client";

import { useQuery } from "convex/react";
import { useUser } from "@clerk/nextjs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { MessageSquare, FileText } from "lucide-react";
import { api } from "@/convex/_generated/api";

export default function DashCards() {
  const { user } = useUser();
  const stats = useQuery(
    api.analytics.getDashboardStats,
    user?.id ? { userId: user.id } : "skip",
  );

  const isLoading = stats === undefined;

  const cardItems = [
    {
      title: "Total Chats",
      value: stats?.totalChats ?? 0,
      icon: MessageSquare,
    },
    {
      title: "Total Messages",
      value: stats?.totalMessages ?? 0,
      icon: FileText,
    },
  ];

  return (
    <div className="grid md:grid-cols-2 gap-4 md:gap-8">
      {cardItems.map((card, index) => (
        <Card key={index}>
          <CardHeader>
            <CardDescription>
              <card.icon className="size-8 text-primary" />
            </CardDescription>
            <CardTitle className="text-xl md:text-2xl md:font-bold text-balance tracking-tighter">
              {card.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-10 w-24" />
            ) : (
              <p className="text-2xl md:text-4xl md:font-bold text-balance tracking-tighter">
                {card.value.toLocaleString()}
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
