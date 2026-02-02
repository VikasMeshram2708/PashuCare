import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");
    return await ctx.storage.generateUploadUrl();
  },
});

export const saveReport = mutation({
  args: {
    chatId: v.optional(v.id("chats")),
    fileId: v.id("_storage"),
    fileName: v.string(),
    mimeType: v.string(),
    sizeBytes: v.number(),
    analysis: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    if (args.sizeBytes > 5 * 1024 * 1024) throw new Error("File too large");

    return await ctx.db.insert("reports", {
      userId: identity.subject,
      chatId: args.chatId,
      fileId: args.fileId,
      fileName: args.fileName,
      mimeType: args.mimeType,
      sizeBytes: args.sizeBytes,
      analysis: args.analysis,
      createdAt: Date.now(),
    });
  },
});

export const saveAnalysis = mutation({
  args: {
    reportId: v.id("reports"),
    analysis: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const report = await ctx.db.get(args.reportId);
    if (!report || report.userId !== identity.subject) {
      throw new Error("Not authorized");
    }

    await ctx.db.patch(args.reportId, {
      analysis: args.analysis,
      updatedAt: Date.now(),
    });
  },
});

export const getUserReports = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    // Return empty array instead of throwing error
    if (!identity) return [];

    return await ctx.db
      .query("reports")
      .withIndex("by_user", (q) => q.eq("userId", identity.subject))
      .order("desc")
      .take(20);
  },
});

export const deleteReport = mutation({
  args: { reportId: v.id("reports") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const report = await ctx.db.get(args.reportId);
    if (!report || report.userId !== identity.subject) {
      throw new Error("Not authorized");
    }

    await ctx.storage.delete(report.fileId);
    await ctx.db.delete(args.reportId);
  },
});

export const getReport = query({
  args: { id: v.id("reports") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const report = await ctx.db.get(args.id);
    if (!report || report.userId !== identity.subject) return null;

    // Generate signed URL for viewing
    const url = await ctx.storage.getUrl(report.fileId);

    return {
      ...report,
      url,
      createdAt: report.createdAt,
    };
  },
});
