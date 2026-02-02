// convex/analytics.ts
import { query } from "./_generated/server";
import { v } from "convex/values";

/**
 * Get dashboard statistics for a user
 * Returns total active chats and total messages
 */
export const getDashboardStats = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, { userId }) => {
    // Get all active chats for the user
    const chats = await ctx.db
      .query("chats")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("isDeleted"), false))
      .collect();

    const totalChats = chats.length;
    const totalMessages = chats.reduce(
      (sum, chat) => sum + chat.messageCount,
      0,
    );

    return {
      totalChats,
      totalMessages,
    };
  },
});

/**
 * Get message activity grouped by day for the last 7 days
 * Returns data formatted for area chart visualization
 */
export const getMessageActivityByDay = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, { userId }) => {
    // Calculate date range (last 7 days)
    const now = Date.now();
    const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;

    // Get all active chats for the user
    const chats = await ctx.db
      .query("chats")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("isDeleted"), false))
      .collect();

    const chatIds = chats.map((chat) => chat._id);

    // Get all messages from the last 7 days
    const messagesByDay: Record<
      string,
      { userMessages: number; assistantMessages: number }
    > = {};

    // Initialize all 7 days with zero counts
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now - i * 24 * 60 * 60 * 1000);
      const dateKey = date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      messagesByDay[dateKey] = { userMessages: 0, assistantMessages: 0 };
    }

    // Fetch messages for each chat and aggregate by day
    for (const chatId of chatIds) {
      const messages = await ctx.db
        .query("messages")
        .withIndex("by_chat", (q) => q.eq("chatId", chatId))
        .filter((q) => q.gte(q.field("createdAt"), sevenDaysAgo))
        .collect();

      for (const message of messages) {
        const date = new Date(message.createdAt);
        const dateKey = date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });

        if (messagesByDay[dateKey]) {
          if (message.role === "user") {
            messagesByDay[dateKey].userMessages++;
          } else if (message.role === "assistant") {
            messagesByDay[dateKey].assistantMessages++;
          }
        }
      }
    }

    // Convert to array format for chart
    return Object.entries(messagesByDay).map(([date, counts]) => ({
      date,
      userMessages: counts.userMessages,
      assistantMessages: counts.assistantMessages,
    }));
  },
});
