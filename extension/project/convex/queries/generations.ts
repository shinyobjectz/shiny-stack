import { query } from "../_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const list = query({
  args: {
    type: v.optional(v.union(
      v.literal("text"),
      v.literal("code"),
      v.literal("presentation"),
      v.literal("video")
    )),
    status: v.optional(v.union(
      v.literal("pending"),
      v.literal("processing"),
      v.literal("completed"),
      v.literal("failed")
    )),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }

    let query = ctx.db.query("generations").withIndex("by_user", (q) => q.eq("userId", userId));
    
    if (args.type) {
      query = query.filter((q) => q.eq(q.field("type"), args.type));
    }
    
    if (args.status) {
      query = query.filter((q) => q.eq(q.field("status"), args.status));
    }

    return await query.order("desc").take(50);
  },
});

export const get = query({
  args: {
    id: v.id("generations"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return null;
    }

    const generation = await ctx.db.get(args.id);
    if (!generation || generation.userId !== userId) {
      return null;
    }

    return generation;
  },
});
