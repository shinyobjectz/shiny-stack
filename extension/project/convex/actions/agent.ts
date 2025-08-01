"use node";

import { action } from "../_generated/server";
import { v } from "convex/values";
import { api } from "../_generated/api";

// Configuration helper for AI settings
async function getAIConfig(ctx: any): Promise<{
  baseUrl: string;
  apiKey: string | undefined;
  defaultModel: string;
  fallbackModel: string;
  maxTokens: number;
  temperature: number;
  timeout: number;
  enableCodeCompletion: boolean;
  enableCodeReview: boolean;
  requestsPerMinute: number;
}> {
  // Get AI configs from database
  const aiConfigs: Record<string, any> = await ctx.runQuery(api.queries.config.getAIConfigs) || {};
  
  return {
    // API Configuration (from environment variables)
    baseUrl: process.env.CONVEX_OPENAI_BASE_URL || "https://api.openai.com/v1",
    apiKey: process.env.CONVEX_OPENAI_API_KEY,
    
    // Model Configuration (from database)
    defaultModel: aiConfigs?.default_model || "gpt-4o-mini",
    fallbackModel: aiConfigs?.fallback_model || "gpt-3.5-turbo",
    
    // Request Configuration (from database)
    maxTokens: aiConfigs?.max_tokens || 2048,
    temperature: aiConfigs?.temperature || 0.7,
    timeout: aiConfigs?.timeout || 30000,
    
    // Feature Flags (from database)
    enableCodeCompletion: aiConfigs?.enable_code_completion ?? true,
    enableCodeReview: aiConfigs?.enable_code_review ?? true,
    
    // Rate Limiting (from database)
    requestsPerMinute: aiConfigs?.requests_per_minute || 60,
  };
}

export const chatAgent = action({
  args: {
    message: v.string(),
    context: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    try {
      // Get AI configuration
      const aiConfig = await getAIConfig(ctx);
      
      // Analyze the user's intent
      const intent = await analyzeIntent(args.message);
      
      // Route to appropriate handler based on intent
      switch (intent.type) {
        case "document_creation":
          return await handleDocumentCreation(ctx, args.message, intent, aiConfig);
        case "presentation_creation":
          return await handlePresentationCreation(ctx, args.message, intent, aiConfig);
        case "data_query":
          return await handleDataQuery(ctx, args.message, intent, aiConfig);
        case "general_chat":
        default:
          return await handleGeneralChat(ctx, args.message, aiConfig);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Agent failed: ${errorMessage}`);
    }
  },
});

async function analyzeIntent(message: string) {
  const lowerMessage = message.toLowerCase();
  
  // Simple intent detection - in a real app, you'd use more sophisticated NLP
  if (lowerMessage.includes("create document") || lowerMessage.includes("write document")) {
    return { type: "document_creation", confidence: 0.9 };
  }
  
  if (lowerMessage.includes("presentation") || lowerMessage.includes("slides")) {
    return { type: "presentation_creation", confidence: 0.9 };
  }
  
  if (lowerMessage.includes("query") || lowerMessage.includes("sql") || lowerMessage.includes("data")) {
    return { type: "data_query", confidence: 0.8 };
  }
  
  return { type: "general_chat", confidence: 0.5 };
}

async function handleDocumentCreation(ctx: any, message: string, intent: any, aiConfig: any) {
  const prompt = `Based on this request: "${message}", help the user create a document. 
  Provide a suggested title and outline, or ask clarifying questions if needed.
  Be helpful and specific about what kind of document they want to create.`;

  const response = await fetch(`${aiConfig.baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${aiConfig.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: aiConfig.defaultModel,
      messages: [{ role: "user", content: prompt }],
      max_tokens: aiConfig.maxTokens,
      temperature: aiConfig.temperature,
    }),
  });

  const data = await response.json();
  return {
    result: data.choices[0].message.content,
    action: "document_creation",
    suggestions: ["Create a new document", "View existing documents"]
  };
}

async function handlePresentationCreation(ctx: any, message: string, intent: any, aiConfig: any) {
  const prompt = `Based on this request: "${message}", help the user create a presentation. 
  Suggest a topic, number of slides, and key points to cover.
  Ask clarifying questions if the request is too vague.`;

  const response = await fetch(`${aiConfig.baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${aiConfig.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: aiConfig.defaultModel,
      messages: [{ role: "user", content: prompt }],
      max_tokens: aiConfig.maxTokens,
      temperature: aiConfig.temperature,
    }),
  });

  const data = await response.json();
  return {
    result: data.choices[0].message.content,
    action: "presentation_creation",
    suggestions: ["Generate presentation", "View existing presentations"]
  };
}

async function handleDataQuery(ctx: any, message: string, intent: any, aiConfig: any) {
  const prompt = `Based on this request: "${message}", help the user with data analysis. 
  If they want to run a SQL query, provide suggestions or help them write the query.
  If they're asking about data in general, provide helpful guidance.`;

  const response = await fetch(`${aiConfig.baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${aiConfig.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: aiConfig.defaultModel,
      messages: [{ role: "user", content: prompt }],
      max_tokens: aiConfig.maxTokens,
      temperature: aiConfig.temperature,
    }),
  });

  const data = await response.json();
  return {
    result: data.choices[0].message.content,
    action: "data_query",
    suggestions: ["Open Data Analytics", "Run sample query"]
  };
}

async function handleGeneralChat(ctx: any, message: string, aiConfig: any) {
  const prompt = `You are an AI assistant for a product studio that helps users create documents, presentations, analyze data, and more. 
  Respond to this message: "${message}"
  Be helpful, friendly, and suggest relevant features when appropriate.`;

  const response = await fetch(`${aiConfig.baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${aiConfig.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: aiConfig.defaultModel,
      messages: [{ role: "user", content: prompt }],
      max_tokens: aiConfig.maxTokens,
      temperature: aiConfig.temperature,
    }),
  });

  const data = await response.json();
  return {
    result: data.choices[0].message.content,
    action: "general_chat",
    suggestions: ["Create a document", "Generate a presentation", "Analyze data"]
  };
}
