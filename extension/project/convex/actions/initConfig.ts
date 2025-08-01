"use node";

import { action } from "../_generated/server";
import { api } from "../_generated/api";

// Initialize app configurations from TOML files
export const initializeConfigs = action({
  args: {},
  handler: async (ctx) => {
    // Default AI configurations
    const aiConfigs = [
      {
        key: "default_model",
        value: "gpt-4o-mini",
        category: "ai",
        description: "Default AI model for text generation",
        isPublic: true,
      },
      {
        key: "fallback_model", 
        value: "gpt-3.5-turbo",
        category: "ai",
        description: "Fallback AI model when primary fails",
        isPublic: true,
      },
      {
        key: "max_tokens",
        value: 2048,
        category: "ai",
        description: "Maximum tokens per request",
        isPublic: true,
      },
      {
        key: "temperature",
        value: 0.7,
        category: "ai",
        description: "AI response creativity (0-1)",
        isPublic: true,
      },
      {
        key: "timeout",
        value: 30000,
        category: "ai",
        description: "Request timeout in milliseconds",
        isPublic: false,
      },
      {
        key: "enable_code_completion",
        value: true,
        category: "ai",
        description: "Enable AI code completion feature",
        isPublic: true,
      },
      {
        key: "enable_code_review",
        value: true,
        category: "ai",
        description: "Enable AI code review feature",
        isPublic: true,
      },
      {
        key: "requests_per_minute",
        value: 60,
        category: "ai",
        description: "Rate limit for AI requests",
        isPublic: false,
      },
    ];

    // UI configurations
    const uiConfigs = [
      {
        key: "theme",
        value: "light",
        category: "ui",
        description: "Default UI theme",
        isPublic: true,
      },
      {
        key: "sidebar_width",
        value: 280,
        category: "ui",
        description: "Sidebar width in pixels",
        isPublic: true,
      },
      {
        key: "enable_animations",
        value: true,
        category: "ui",
        description: "Enable UI animations",
        isPublic: true,
      },
    ];

    // Feature configurations
    const featureConfigs = [
      {
        key: "enable_document_creation",
        value: true,
        category: "features",
        description: "Enable document creation feature",
        isPublic: true,
      },
      {
        key: "enable_presentation_creation",
        value: true,
        category: "features",
        description: "Enable presentation creation feature",
        isPublic: true,
      },
      {
        key: "enable_data_analysis",
        value: true,
        category: "features",
        description: "Enable data analysis feature",
        isPublic: true,
      },
      {
        key: "enable_video_creation",
        value: false,
        category: "features",
        description: "Enable video creation feature (beta)",
        isPublic: true,
      },
    ];

    // Combine all configs
    const allConfigs = [...aiConfigs, ...uiConfigs, ...featureConfigs];

    // Use the bulk set mutation to initialize all configs
    await ctx.runMutation(api.mutations.config.setBulkConfig, {
      configs: allConfigs,
    });

    return {
      message: `Initialized ${allConfigs.length} configurations`,
      categories: {
        ai: aiConfigs.length,
        ui: uiConfigs.length,
        features: featureConfigs.length,
      },
    };
  },
}); 