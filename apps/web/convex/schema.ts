// convex/schema.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  chats: defineTable({
    name: v.string(),
    userId: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(), // Required for proper sorting
    isDeleted: v.boolean(), // Required (no optional for index fields)
    messageCount: v.number(), // Denormalized counter
  })
    .index("by_user_active", ["userId", "isDeleted", "updatedAt"])
    .index("by_user_created", ["userId", "isDeleted", "createdAt"])
    .index("by_user", ["userId"]),

  messages: defineTable({
    chatId: v.id("chats"),
    role: v.union(
      v.literal("user"),
      v.literal("assistant"),
      v.literal("system"),
    ),
    content: v.string(),
    status: v.union(
      v.literal("pending"),
      v.literal("streaming"), // New: actively receiving chunks
      v.literal("sent"),
      v.literal("error"),
    ),
    tokens: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
  })
    .index("by_chat", ["chatId", "createdAt"]) // Oldest first
    .index("by_chat_desc", ["chatId"]) // Newest first (auto _creationTime)
    .index("by_status", ["status", "createdAt"]),

  reports: defineTable({
    userId: v.string(),
    chatId: v.optional(v.id("chats")), // in uploaded from chat
    fileId: v.id("_storage"),
    fileName: v.string(),
    mimeType: v.string(), // e.g application/pdf
    sizeBytes: v.number(),
    analysis: v.optional(v.string()), // AI generated analysis content
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
  })
    .index("by_user", ["userId", "createdAt"])
    .index("by_chat", ["chatId", "createdAt"]),
});
