import { mutation } from "../_generated/server";
import { v } from "convex/values";

export const create = mutation({
  args: {
    userId: v.id("users"),
    query: v.string(),
    result: v.string(),
    database: v.string(),
    executionTime: v.number(),
    status: v.union(v.literal("success"), v.literal("error")),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("queries", args);
  },
});
