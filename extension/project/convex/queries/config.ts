import { query } from "../_generated/server";
import { v } from "convex/values";

// Get a single configuration value
export const getConfig = query({
  args: {
    key: v.string(),
  },
  handler: async (ctx, args) => {
    const config = await ctx.db
      .query("config")
      .withIndex("by_key", (q) => q.eq("key", args.key))
      .first();
    
    return config?.value;
  },
});

// Get all configurations for a category
export const getConfigsByCategory = query({
  args: {
    category: v.string(),
  },
  handler: async (ctx, args) => {
    const configs = await ctx.db
      .query("config")
      .withIndex("by_category", (q) => q.eq("category", args.category))
      .collect();
    
    return configs.reduce((acc, config) => {
      acc[config.key] = config.value;
      return acc;
    }, {} as Record<string, any>);
  },
});

// Get all public configurations (available to frontend)
export const getPublicConfigs = query({
  args: {},
  handler: async (ctx) => {
    const configs = await ctx.db
      .query("config")
      .withIndex("public_configs", (q) => q.eq("isPublic", true))
      .collect();
    
    return configs.reduce((acc, config) => {
      acc[config.key] = config.value;
      return acc;
    }, {} as Record<string, any>);
  },
});

// Get all configurations (admin only)
export const getAllConfigs = query({
  args: {},
  handler: async (ctx) => {
    const configs = await ctx.db.query("config").collect();
    
    return configs.reduce((acc, config) => {
      if (!acc[config.category]) {
        acc[config.category] = {};
      }
      acc[config.category][config.key] = {
        value: config.value,
        description: config.description,
        isPublic: config.isPublic,
        updatedAt: config.updatedAt,
      };
      return acc;
    }, {} as Record<string, Record<string, any>>);
  },
});

// Get AI-specific configurations
export const getAIConfigs = query({
  args: {},
  handler: async (ctx) => {
    const configs = await ctx.db
      .query("config")
      .withIndex("by_category", (q) => q.eq("category", "ai"))
      .collect();
    
    return configs.reduce((acc, config) => {
      acc[config.key] = config.value;
      return acc;
    }, {} as Record<string, any>);
  },
}); 