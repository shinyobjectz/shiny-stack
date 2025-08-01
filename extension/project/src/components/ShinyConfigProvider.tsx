// ShinyStack Configuration Provider for React
// This component provides dynamic configuration access throughout the app

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { loadShinyConfigs, getShinyValue, setShinyValue, ShinyConfigValue } from '../lib/shiny';

interface ShinyConfigContextType {
  configs: Map<string, any>;
  loading: boolean;
  error: string | null;
  getValue: (path: string) => ShinyConfigValue | undefined;
  setValue: (path: string, value: ShinyConfigValue) => void;
  reload: () => Promise<void>;
}

const ShinyConfigContext = createContext<ShinyConfigContextType | undefined>(undefined);

interface ShinyConfigProviderProps {
  children: ReactNode;
}

export const ShinyConfigProvider: React.FC<ShinyConfigProviderProps> = ({ children }) => {
  const [configs, setConfigs] = useState<Map<string, any>>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadConfigurations = async () => {
    try {
      setLoading(true);
      setError(null);
      const loadedConfigs = await loadShinyConfigs();
      setConfigs(loadedConfigs);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load configurations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConfigurations();
  }, []);

  const getValue = (path: string): ShinyConfigValue | undefined => {
    return getShinyValue(path);
  };

  const setValue = (path: string, value: ShinyConfigValue): void => {
    setShinyValue(path, value);
    // Optionally trigger a re-render by updating the configs state
    setConfigs(new Map(configs));
  };

  const reload = async (): Promise<void> => {
    await loadConfigurations();
  };

  const value: ShinyConfigContextType = {
    configs,
    loading,
    error,
    getValue,
    setValue,
    reload,
  };

  return (
    <ShinyConfigContext.Provider value={value}>
      {children}
    </ShinyConfigContext.Provider>
  );
};

// Custom hook to use the Shiny configuration
export const useShinyConfig = () => {
  const context = useContext(ShinyConfigContext);
  if (context === undefined) {
    throw new Error('useShinyConfig must be used within a ShinyConfigProvider');
  }
  return context;
};

// Hook for getting a specific configuration value
export const useShinyValue = (path: string) => {
  const { getValue, loading, error } = useShinyConfig();
  const [value, setValue] = useState<ShinyConfigValue | undefined>(undefined);

  useEffect(() => {
    if (!loading && !error) {
      setValue(getValue(path));
    }
  }, [path, loading, error, getValue]);

  return { value, loading, error };
};

// Hook for getting a specific configuration section
export const useShinyConfig = (configName: string) => {
  const { configs, loading, error } = useShinyConfig();
  const [config, setConfig] = useState<any>(undefined);

  useEffect(() => {
    if (!loading && !error) {
      setConfig(configs.get(configName));
    }
  }, [configName, loading, error, configs]);

  return { config, loading, error };
};

// Example component that uses the configuration
export const ShinyConfigDisplay: React.FC = () => {
  const { configs, loading, error, reload } = useShinyConfig();
  const aiConfig = useShinyConfig('ai');
  const themeValue = useShinyValue('styles.theme.name');

  if (loading) {
    return <div>Loading configurations...</div>;
  }

  if (error) {
    return (
      <div>
        <p>Error loading configurations: {error}</p>
        <button onClick={reload}>Retry</button>
      </div>
    );
  }

  return (
    <div>
      <h2>ShinyStack Configuration</h2>
      
      <div>
        <h3>Available Configurations:</h3>
        <ul>
          {Array.from(configs.keys()).map((name) => (
            <li key={name}>{name}</li>
          ))}
        </ul>
      </div>

      <div>
        <h3>AI Configuration:</h3>
        {aiConfig.config && (
          <pre>{JSON.stringify(aiConfig.config, null, 2)}</pre>
        )}
      </div>

      <div>
        <h3>Theme Name:</h3>
        <p>{themeValue.value || 'Not set'}</p>
      </div>

      <button onClick={reload}>Reload Configurations</button>
    </div>
  );
};

// Example component for dynamic form generation
export const ShinyConfigForm: React.FC<{ configName: string }> = ({ configName }) => {
  const { config, loading, error } = useShinyConfig(configName);
  const { setValue } = useShinyConfig();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!config) return <div>Configuration not found</div>;

  const renderFormField = (key: string, value: any, path: string) => {
    const fieldPath = `${configName}.${path}`;

    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      return (
        <div key={key} style={{ marginLeft: '20px' }}>
          <h4>{key}</h4>
          {Object.entries(value).map(([subKey, subValue]) =>
            renderFormField(subKey, subValue, `${path}.${subKey}`)
          )}
        </div>
      );
    }

    return (
      <div key={key} style={{ margin: '10px 0' }}>
        <label>
          {key}:
          {typeof value === 'boolean' ? (
            <input
              type="checkbox"
              checked={value}
              onChange={(e) => setValue(fieldPath, e.target.checked)}
            />
          ) : typeof value === 'number' ? (
            <input
              type="number"
              value={value}
              onChange={(e) => setValue(fieldPath, parseFloat(e.target.value))}
            />
          ) : Array.isArray(value) ? (
            <input
              type="text"
              value={value.join(', ')}
              onChange={(e) => setValue(fieldPath, e.target.value.split(', '))}
            />
          ) : (
            <input
              type="text"
              value={value}
              onChange={(e) => setValue(fieldPath, e.target.value)}
            />
          )}
        </label>
      </div>
    );
  };

  return (
    <div>
      <h3>Edit {configName} Configuration</h3>
      <form onSubmit={(e) => e.preventDefault()}>
        {Object.entries(config).map(([key, value]) =>
          renderFormField(key, value, key)
        )}
      </form>
    </div>
  );
}; 