import { query } from "../_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const list = query({
  args: {},
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }

    return await ctx.db.query("documents")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();
  },
});

export const get = query({
  args: {
    id: v.id("documents"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return null;
    }

    const document = await ctx.db.get(args.id);
    if (!document || document.userId !== userId) {
      return null;
    }

    return document;
  },
});

export const search = query({
  args: {
    searchTerm: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }

    return await ctx.db.query("documents")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.or(
        q.eq(q.field("title"), args.searchTerm),
        q.eq(q.field("content"), args.searchTerm)
      ))
      .take(20);
  },
});
