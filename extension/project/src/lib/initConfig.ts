import { useMutation, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";

// Hook to initialize app configurations
export function useInitConfig() {
  const initializeConfigs = useMutation(api.actions.initConfig.initializeConfigs);
  
  const initConfigs = async () => {
    try {
      const result = await initializeConfigs();
      console.log("App configurations initialized:", result);
      return result;
    } catch (error) {
      console.error("Failed to initialize configurations:", error);
      throw error;
    }
  };
  
  return { initConfigs };
}

// Utility to check if configs need initialization
export function useConfigStatus() {
  const publicConfigs = useQuery(api.queries.config.getPublicConfigs);
  
  return {
    isInitialized: publicConfigs && Object.keys(publicConfigs).length > 0,
    isLoading: publicConfigs === undefined,
    configCount: publicConfigs ? Object.keys(publicConfigs).length : 0,
  };
} 