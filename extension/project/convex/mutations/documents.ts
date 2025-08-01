import { mutation } from "../_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const create = mutation({
  args: {
    title: v.string(),
    content: v.string(),
    type: v.union(v.literal("document"), v.literal("presentation"), v.literal("video")),
    metadata: v.optional(v.object({
      tags: v.optional(v.array(v.string())),
      description: v.optional(v.string()),
      thumbnail: v.optional(v.id("_storage")),
    })),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    return await ctx.db.insert("documents", {
      ...args,
      userId,
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("documents"),
    title: v.optional(v.string()),
    content: v.optional(v.string()),
    metadata: v.optional(v.object({
      tags: v.optional(v.array(v.string())),
      description: v.optional(v.string()),
      thumbnail: v.optional(v.id("_storage")),
    })),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const document = await ctx.db.get(args.id);
    if (!document || document.userId !== userId) {
      throw new Error("Document not found or access denied");
    }

    const { id, ...updates } = args;
    return await ctx.db.patch(id, updates);
  },
});

export const remove = mutation({
  args: {
    id: v.id("documents"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const document = await ctx.db.get(args.id);
    if (!document || document.userId !== userId) {
      throw new Error("Document not found or access denied");
    }

    return await ctx.db.delete(args.id);
  },
});
