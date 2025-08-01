"use node";

import { action } from "../_generated/server";
import { v } from "convex/values";

export const textGeneration = action({
  args: {
    prompt: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      const response = await fetch(`${process.env.CONVEX_OPENAI_BASE_URL}/chat/completions`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.CONVEX_OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4.1-nano",
          messages: [{ role: "user", content: args.prompt }],
        }),
      });

      const data: any = await response.json();
      const result: string = data.choices[0].message.content;

      return { result };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Generation failed: ${errorMessage}`);
    }
  },
});

export const presentation = action({
  args: {
    topic: v.string(),
    slides: v.number(),
  },
  handler: async (ctx, args) => {
    const prompt = `Create a ${args.slides}-slide presentation about "${args.topic}". 
    Return a JSON structure with slides array, each containing title and content.
    Format for Reveal.js compatibility.`;

    try {
      const response = await fetch(`${process.env.CONVEX_OPENAI_BASE_URL}/chat/completions`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.CONVEX_OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [{ role: "user", content: prompt }],
        }),
      });

      const data = await response.json();
      const result = data.choices[0].message.content;

      return { result };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Generation failed: ${errorMessage}`);
    }
  },
});

export const code = action({
  args: {
    description: v.string(),
    language: v.string(),
  },
  handler: async (ctx, args) => {
    const prompt = `Generate ${args.language} code for: ${args.description}. 
    Provide clean, well-commented code with proper structure.`;

    try {
      const response = await fetch(`${process.env.CONVEX_OPENAI_BASE_URL}/chat/completions`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.CONVEX_OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [{ role: "user", content: prompt }],
        }),
      });

      const data = await response.json();
      const result = data.choices[0].message.content;

      return { result };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Generation failed: ${errorMessage}`);
    }
  },
});
