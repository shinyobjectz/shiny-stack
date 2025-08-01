import React from 'react';
import { useAppConfig, useAIConfig, useUIConfig, useFeatureFlags } from '../features/ai/hooks/useAppConfig';
import { useInitConfig, useConfigStatus } from '../lib/initConfig';

export function ConfigExample() {
  const { initConfigs } = useInitConfig();
  const { isInitialized, isLoading, configCount } = useConfigStatus();
  
  const { ai, ui, features, isLoading: configsLoading } = useAppConfig();
  const aiConfig = useAIConfig();
  const uiConfig = useUIConfig();
  const featureFlags = useFeatureFlags();

  const handleInitialize = async () => {
    try {
      await initConfigs();
    } catch (error) {
      console.error('Failed to initialize configs:', error);
    }
  };

  if (isLoading || configsLoading) {
    return <div>Loading configurations...</div>;
  }

  if (!isInitialized) {
    return (
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-4">Initialize App Configurations</h2>
        <p className="mb-4">No configurations found. Click the button below to initialize default settings.</p>
        <button 
          onClick={handleInitialize}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Initialize Configurations
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">App Configurations</h2>
        <span className="text-sm text-gray-500">{configCount} configs loaded</span>
      </div>

      {/* AI Configuration */}
      <div className="border rounded-lg p-4">
        <h3 className="font-medium mb-2">AI Settings</h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>Default Model: {aiConfig.defaultModel}</div>
          <div>Max Tokens: {aiConfig.maxTokens}</div>
          <div>Temperature: {aiConfig.temperature}</div>
          <div>Code Completion: {aiConfig.enableCodeCompletion ? 'Enabled' : 'Disabled'}</div>
        </div>
      </div>

      {/* UI Configuration */}
      <div className="border rounded-lg p-4">
        <h3 className="font-medium mb-2">UI Settings</h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>Theme: {uiConfig.theme}</div>
          <div>Sidebar Width: {uiConfig.sidebarWidth}px</div>
          <div>Animations: {uiConfig.enableAnimations ? 'Enabled' : 'Disabled'}</div>
        </div>
      </div>

      {/* Feature Flags */}
      <div className="border rounded-lg p-4">
        <h3 className="font-medium mb-2">Feature Flags</h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>Document Creation: {featureFlags.enableDocumentCreation ? '✅' : '❌'}</div>
          <div>Presentation Creation: {featureFlags.enablePresentationCreation ? '✅' : '❌'}</div>
          <div>Data Analysis: {featureFlags.enableDataAnalysis ? '✅' : '❌'}</div>
          <div>Video Creation: {featureFlags.enableVideoCreation ? '✅' : '❌'}</div>
        </div>
      </div>

      {/* Raw Config Data */}
      <div className="border rounded-lg p-4">
        <h3 className="font-medium mb-2">Raw Configuration Data</h3>
        <details className="text-sm">
          <summary className="cursor-pointer">Click to expand</summary>
          <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto">
            {JSON.stringify({ ai, ui, features }, null, 2)}
          </pre>
        </details>
      </div>
    </div>
  );
} 