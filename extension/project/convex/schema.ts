import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const applicationTables = {
  documents: defineTable({
    title: v.string(),
    content: v.string(),
    type: v.union(v.literal("document"), v.literal("presentation"), v.literal("video")),
    userId: v.id("users"),
    metadata: v.optional(v.object({
      tags: v.optional(v.array(v.string())),
      description: v.optional(v.string()),
      thumbnail: v.optional(v.id("_storage")),
    })),
  })
    .index("by_user", ["userId"])
    .index("by_type", ["type"])
    .searchIndex("search_content", {
      searchField: "content",
      filterFields: ["userId", "type"],
    }),

  generations: defineTable({
    userId: v.id("users"),
    documentId: v.optional(v.id("documents")),
    prompt: v.string(),
    result: v.string(),
    type: v.union(
      v.literal("text"),
      v.literal("code"),
      v.literal("presentation"),
      v.literal("video")
    ),
    status: v.union(
      v.literal("pending"),
      v.literal("processing"),
      v.literal("completed"),
      v.literal("failed")
    ),
    metadata: v.optional(v.object({
      model: v.optional(v.string()),
      tokens: v.optional(v.number()),
      duration: v.optional(v.number()),
    })),
  })
    .index("by_user", ["userId"])
    .index("by_status", ["status"])
    .index("by_document", ["documentId"]),

  queries: defineTable({
    userId: v.id("users"),
    query: v.string(),
    result: v.string(),
    database: v.string(),
    executionTime: v.number(),
    status: v.union(v.literal("success"), v.literal("error")),
  })
    .index("by_user", ["userId"])
    .index("by_database", ["database"]),

  sessions: defineTable({
    userId: v.id("users"),
    type: v.union(
      v.literal("editor"),
      v.literal("presentation"),
      v.literal("video"),
      v.literal("data")
    ),
    data: v.string(),
    lastAccessed: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_type", ["type"]),

  // App-wide configuration settings
  config: defineTable({
    key: v.string(),
    value: v.any(), // Flexible value type for different config types
    category: v.string(), // e.g., "ai", "ui", "features"
    description: v.optional(v.string()),
    isPublic: v.boolean(), // Whether this config is available to frontend
    updatedAt: v.number(),
  })
    .index("by_key", ["key"])
    .index("by_category", ["category"])
    .index("public_configs", ["isPublic"]),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
