import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

// Hook to get app-wide configurations
export function useAppConfig() {
  const publicConfigs = useQuery(api.queries.config.getPublicConfigs);
  const aiConfigs = useQuery(api.queries.config.getAIConfigs);
  const uiConfigs = useQuery(api.queries.config.getConfigsByCategory, { category: "ui" });
  const featureConfigs = useQuery(api.queries.config.getConfigsByCategory, { category: "features" });

  return {
    // All public configurations
    public: publicConfigs || {},
    
    // AI-specific configurations
    ai: aiConfigs || {},
    
    // UI configurations
    ui: uiConfigs || {},
    
    // Feature flags
    features: featureConfigs || {},
    
    // Helper functions
    getValue: (key: string) => publicConfigs?.[key],
    getAIValue: (key: string) => aiConfigs?.[key],
    getUIValue: (key: string) => uiConfigs?.[key],
    getFeatureValue: (key: string) => featureConfigs?.[key],
    
    // Feature checks
    isFeatureEnabled: (feature: string) => featureConfigs?.[feature] === true,
    
    // Loading state
    isLoading: !publicConfigs || !aiConfigs || !uiConfigs || !featureConfigs,
  };
}

// Hook for AI-specific configurations
export function useAIConfig() {
  const aiConfigs = useQuery(api.queries.config.getAIConfigs);
  
  return {
    // AI model settings
    defaultModel: aiConfigs?.default_model || "gpt-4o-mini",
    fallbackModel: aiConfigs?.fallback_model || "gpt-3.5-turbo",
    maxTokens: aiConfigs?.max_tokens || 2048,
    temperature: aiConfigs?.temperature || 0.7,
    timeout: aiConfigs?.timeout || 30000,
    
    // Feature flags
    enableCodeCompletion: aiConfigs?.enable_code_completion ?? true,
    enableCodeReview: aiConfigs?.enable_code_review ?? true,
    
    // Rate limiting
    requestsPerMinute: aiConfigs?.requests_per_minute || 60,
    
    // Loading state
    isLoading: !aiConfigs,
  };
}

// Hook for UI configurations
export function useUIConfig() {
  const uiConfigs = useQuery(api.queries.config.getConfigsByCategory, { category: "ui" });
  
  return {
    theme: uiConfigs?.theme || "light",
    sidebarWidth: uiConfigs?.sidebar_width || 280,
    enableAnimations: uiConfigs?.enable_animations ?? true,
    isLoading: !uiConfigs,
  };
}

// Hook for feature flags
export function useFeatureFlags() {
  const featureConfigs = useQuery(api.queries.config.getConfigsByCategory, { category: "features" });
  
  return {
    enableDocumentCreation: featureConfigs?.enable_document_creation ?? true,
    enablePresentationCreation: featureConfigs?.enable_presentation_creation ?? true,
    enableDataAnalysis: featureConfigs?.enable_data_analysis ?? true,
    enableVideoCreation: featureConfigs?.enable_video_creation ?? false,
    isLoading: !featureConfigs,
  };
} 