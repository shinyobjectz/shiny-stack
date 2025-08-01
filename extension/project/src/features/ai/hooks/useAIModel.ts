// AI Model Hook for ShinyStack
// This hook provides AI model management and configuration

import { useState, useEffect } from 'react';
import { useShinyValue } from '../../lib/shiny';

export interface AIModel {
  id: string;
  name: string;
  provider: string;
  maxTokens: number;
  temperature: number;
  costPerToken: number;
}

export interface AIModelConfig {
  primaryModel: string;
  fallbackModel: string;
  maxTokens: number;
  temperature: number;
  timeout: number;
}

export function useAIModel() {
  const [selectedModel, setSelectedModel] = useState<string>('gpt-4');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get AI configuration from ShinyStack config
  const aiConfig = useShinyValue('ai.models');
  const apiConfig = useShinyValue('ai.api');

  const availableModels: AIModel[] = [
    {
      id: 'gpt-4',
      name: 'GPT-4',
      provider: 'OpenAI',
      maxTokens: 8192,
      temperature: 0.7,
      costPerToken: 0.00003
    },
    {
      id: 'gpt-3.5-turbo',
      name: 'GPT-3.5 Turbo',
      provider: 'OpenAI',
      maxTokens: 4096,
      temperature: 0.7,
      costPerToken: 0.000002
    },
    {
      id: 'claude-3-opus',
      name: 'Claude 3 Opus',
      provider: 'Anthropic',
      maxTokens: 200000,
      temperature: 0.7,
      costPerToken: 0.000015
    },
    {
      id: 'claude-3-sonnet',
      name: 'Claude 3 Sonnet',
      provider: 'Anthropic',
      maxTokens: 200000,
      temperature: 0.7,
      costPerToken: 0.000003
    }
  ];

  const currentModel = availableModels.find(model => model.id === selectedModel);
  const primaryModel = aiConfig?.primary_model || 'gpt-4';
  const fallbackModel = aiConfig?.fallback_model || 'gpt-3.5-turbo';

  useEffect(() => {
    // Set the primary model as default
    if (primaryModel && availableModels.find(m => m.id === primaryModel)) {
      setSelectedModel(primaryModel);
    }
  }, [primaryModel]);

  const switchToFallback = () => {
    if (fallbackModel && availableModels.find(m => m.id === fallbackModel)) {
      setSelectedModel(fallbackModel);
      return true;
    }
    return false;
  };

  const getModelConfig = (): AIModelConfig => {
    return {
      primaryModel,
      fallbackModel,
      maxTokens: aiConfig?.max_tokens || 4096,
      temperature: aiConfig?.temperature || 0.7,
      timeout: apiConfig?.timeout || 30000
    };
  };

  const estimateCost = (tokens: number): number => {
    if (!currentModel) return 0;
    return tokens * currentModel.costPerToken;
  };

  const validateModel = (modelId: string): boolean => {
    return availableModels.some(model => model.id === modelId);
  };

  return {
    // State
    selectedModel,
    setSelectedModel,
    isLoading,
    setIsLoading,
    error,
    setError,

    // Data
    availableModels,
    currentModel,
    primaryModel,
    fallbackModel,

    // Actions
    switchToFallback,
    getModelConfig,
    estimateCost,
    validateModel,

    // Configuration
    config: getModelConfig(),
  };
} 