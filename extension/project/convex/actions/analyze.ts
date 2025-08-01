"use node";

import { action } from "../_generated/server";
import { v } from "convex/values";

export const data = action({
  args: {
    query: v.string(),
    database: v.string(),
  },
  handler: async (ctx, args) => {
    const startTime = Date.now();

    try {
      // Basic safety checks
      const sanitizedQuery = args.query.toLowerCase();
      const dangerousKeywords = ['drop', 'delete', 'truncate', 'alter', 'create'];
      const hasDangerous = dangerousKeywords.some(keyword => 
        sanitizedQuery.includes(keyword)
      );

      if (hasDangerous) {
        throw new Error("Query contains potentially dangerous operations");
      }

      // Simulate query execution with mock data
      const mockResult = {
        columns: ['id', 'name', 'value'],
        rows: [
          [1, 'Sample Data', 100],
          [2, 'Test Record', 200],
          [3, 'Example Entry', 300],
        ],
        rowCount: 3,
      };

      const executionTime = Date.now() - startTime;

      return {
        ...mockResult,
        executionTime,
        database: args.database,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Query failed: ${errorMessage}`);
    }
  },
});
