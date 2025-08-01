import { mutation } from "../_generated/server";
import { v } from "convex/values";

// Set or update a configuration value
export const setConfig = mutation({
  args: {
    key: v.string(),
    value: v.any(),
    category: v.string(),
    description: v.optional(v.string()),
    isPublic: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { key, value, category, description, isPublic = false } = args;
    
    // Check if config already exists
    const existing = await ctx.db
      .query("config")
      .withIndex("by_key", (q) => q.eq("key", key))
      .first();
    
    if (existing) {
      // Update existing config
      await ctx.db.patch(existing._id, {
        value,
        category,
        description,
        isPublic,
        updatedAt: Date.now(),
      });
      return existing._id;
    } else {
      // Create new config
      return await ctx.db.insert("config", {
        key,
        value,
        category,
        description,
        isPublic,
        updatedAt: Date.now(),
      });
    }
  },
});

// Delete a configuration
export const deleteConfig = mutation({
  args: {
    key: v.string(),
  },
  handler: async (ctx, args) => {
    const config = await ctx.db
      .query("config")
      .withIndex("by_key", (q) => q.eq("key", args.key))
      .first();
    
    if (config) {
      await ctx.db.delete(config._id);
    }
  },
});

// Bulk set configurations (useful for initialization)
export const setBulkConfig = mutation({
  args: {
    configs: v.array(v.object({
      key: v.string(),
      value: v.any(),
      category: v.string(),
      description: v.optional(v.string()),
      isPublic: v.optional(v.boolean()),
    })),
  },
  handler: async (ctx, args) => {
    const results = [];
    
    for (const config of args.configs) {
      const existing = await ctx.db
        .query("config")
        .withIndex("by_key", (q) => q.eq("key", config.key))
        .first();
      
      if (existing) {
        await ctx.db.patch(existing._id, {
          value: config.value,
          category: config.category,
          description: config.description,
          isPublic: config.isPublic ?? false,
          updatedAt: Date.now(),
        });
        results.push(existing._id);
      } else {
        const id = await ctx.db.insert("config", {
          key: config.key,
          value: config.value,
          category: config.category,
          description: config.description,
          isPublic: config.isPublic ?? false,
          updatedAt: Date.now(),
        });
        results.push(id);
      }
    }
    
    return results;
  },
}); 