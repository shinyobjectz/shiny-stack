import React, { useState, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs';
import { Button } from './ui/button';
import { ConfigSection } from './ConfigSection';
import { ConfigFormField } from './ConfigFormField';
import { ConfigFile, ConfigValue } from '../types/config';
import { parseTomlContent, formDataToToml } from '../utils/tomlParser';

interface ConfigEditorProps {
  configFiles: { name: string; content: string }[];
  onSave?: (fileName: string, content: string) => void;
}

export const ConfigEditor: React.FC<ConfigEditorProps> = ({ configFiles, onSave }) => {
  const [parsedConfigs, setParsedConfigs] = useState<ConfigFile[]>([]);
  const [formData, setFormData] = useState<{ [key: string]: any }>({});
  const [activeTab, setActiveTab] = useState<string>('');

  useEffect(() => {
    const parsed = configFiles.map(file => parseTomlContent(file.content, file.name));
    setParsedConfigs(parsed);
    setActiveTab(parsed[0]?.name || '');
  }, [configFiles]);

  const handleFieldChange = (configName: string, path: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [configName]: {
        ...prev[configName],
        [path]: value
      }
    }));
  };

  const handleSave = (configName: string) => {
    const configData = formData[configName] || {};
    const tomlContent = formDataToToml(configData);
    onSave?.(configName, tomlContent);
  };

  const renderConfigContent = (config: ConfigFile) => {
    return (
      <div className="form-container">
        {/* Top-level values */}
        {config.topLevelValues.length > 0 && (
          <div className="form-section">
            <h2 className="section-header">
              General Settings
            </h2>
            {config.topLevelValues.map((value, index) => (
              <ConfigFormField
                key={`top-${value.key || index}`}
                field={value}
                onChange={(path, value) => handleFieldChange(config.name, path, value)}
              />
            ))}
          </div>
        )}

        {/* Sections */}
        {config.sections.map((section) => (
          <ConfigSection
            key={section.path}
            section={section}
            onChange={(path, value) => handleFieldChange(config.name, path, value)}
          />
        ))}

        {/* Save button */}
        <div className="form-section">
          <button 
            onClick={() => handleSave(config.name)}
            className="save-button"
          >
            Save {config.name}
          </button>
        </div>
      </div>
    );
  };

  if (parsedConfigs.length === 0) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>No config files found</p>
      </div>
    );
  }

  return (
    <div className="tabs-container">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="tabs-list">
          {parsedConfigs.map((config) => (
            <TabsTrigger key={config.name} value={config.name} className="tabs-trigger">
              {config.name.replace('.config', '').replace('.shiny', '')}
            </TabsTrigger>
          ))}
        </TabsList>

        {parsedConfigs.map((config) => (
          <TabsContent key={config.name} value={config.name} className="tabs-content">
            {renderConfigContent(config)}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}; 