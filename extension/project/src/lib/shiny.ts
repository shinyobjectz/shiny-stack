// ShinyStack Dynamic Configuration Loader for Frontend
// This file procedurally loads and parses any TOML configuration files

import { parse } from 'toml';

export type ShinyConfigValue = string | number | boolean | ShinyConfigValue[] | { [key: string]: ShinyConfigValue };

export interface ShinyConfig {
  [key: string]: ShinyConfigValue;
}

class DynamicShinyConfigLoader {
  private configs: Map<string, ShinyConfig> = new Map();
  private loaded = false;

  async loadAllConfigs(): Promise<Map<string, ShinyConfig>> {
    if (this.loaded) {
      return this.configs;
    }

    try {
      // Dynamically discover and load all .config and .shiny files
      const configFiles = await this.discoverConfigFiles();
      
      // Load all config files in parallel
      const loadPromises = configFiles.map(async (filename) => {
        const config = await this.loadConfigFile(filename);
        const configName = this.getConfigName(filename);
        this.configs.set(configName, config);
        return { name: configName, config };
      });

      await Promise.all(loadPromises);
      this.loaded = true;
      
      return this.configs;
    } catch (error) {
      console.error('Failed to load ShinyStack configurations:', error);
      throw error;
    }
  }

  private async discoverConfigFiles(): Promise<string[]> {
    // In a real implementation, you might want to fetch a manifest or scan the directory
    // For now, we'll use a predefined list that can be extended
    const knownConfigFiles = [
      'ai.config',
      'architecture.config', 
      'opencode.config',
      'styles.config',
      'glossary.shiny'
    ];

    // Filter to only files that exist (you could implement a check here)
    return knownConfigFiles;
  }

  private getConfigName(filename: string): string {
    // Extract config name from filename (e.g., "ai.config" -> "ai")
    return filename.replace(/\.(config|shiny)$/, '');
  }

  private async loadConfigFile(filename: string): Promise<ShinyConfig> {
    try {
      const response = await fetch(`/configs/${filename}`);
      if (!response.ok) {
        throw new Error(`Failed to load ${filename}: ${response.statusText}`);
      }
      const tomlContent = await response.text();
      const parsed = parse(tomlContent);
      
      // Validate the parsed TOML structure
      this.validateConfigStructure(parsed, filename);
      
      return parsed;
    } catch (error) {
      console.warn(`Could not load ${filename}:`, error);
      return {};
    }
  }

  private validateConfigStructure(config: any, filename: string): void {
    if (typeof config !== 'object' || config === null) {
      throw new Error(`Invalid config structure in ${filename}: must be an object`);
    }
    
    // Recursively validate nested structures
    this.validateNestedStructure(config, filename);
  }

  private validateNestedStructure(obj: any, filename: string, path: string = ''): void {
    for (const [key, value] of Object.entries(obj)) {
      const currentPath = path ? `${path}.${key}` : key;
      
      if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
        // Recursively validate nested objects
        this.validateNestedStructure(value, filename, currentPath);
      } else if (Array.isArray(value)) {
        // Validate arrays
        if (!value.every(item => this.isValidConfigValue(item))) {
          throw new Error(`Invalid array value in ${filename} at ${currentPath}`);
        }
      } else if (!this.isValidConfigValue(value)) {
        throw new Error(`Invalid value type in ${filename} at ${currentPath}: ${typeof value}`);
      }
    }
  }

  private isValidConfigValue(value: any): boolean {
    return (
      typeof value === 'string' ||
      typeof value === 'number' ||
      typeof value === 'boolean' ||
      Array.isArray(value) ||
      (typeof value === 'object' && value !== null)
    );
  }

  // Get all loaded configs
  getAllConfigs(): Map<string, ShinyConfig> {
    if (!this.loaded) {
      throw new Error('Configurations not loaded. Call loadAllConfigs() first.');
    }
    return new Map(this.configs);
  }

  // Get a specific config by name
  getConfig(configName: string): ShinyConfig | undefined {
    if (!this.loaded) {
      throw new Error('Configurations not loaded. Call loadAllConfigs() first.');
    }
    return this.configs.get(configName);
  }

  // Get a nested value from any config using dot notation
  getValue(path: string): ShinyConfigValue | undefined {
    if (!this.loaded) {
      throw new Error('Configurations not loaded. Call loadAllConfigs() first.');
    }

    const [configName, ...nestedPath] = path.split('.');
    const config = this.configs.get(configName);
    
    if (!config) {
      return undefined;
    }

    if (nestedPath.length === 0) {
      return config;
    }

    return this.getNestedValue(config, nestedPath);
  }

  private getNestedValue(obj: any, path: string[]): ShinyConfigValue | undefined {
    let current = obj;
    
    for (const key of path) {
      if (current && typeof current === 'object' && key in current) {
        current = current[key];
      } else {
        return undefined;
      }
    }
    
    return current;
  }

  // Set a value in a config (useful for runtime modifications)
  setValue(path: string, value: ShinyConfigValue): void {
    if (!this.loaded) {
      throw new Error('Configurations not loaded. Call loadAllConfigs() first.');
    }

    const [configName, ...nestedPath] = path.split('.');
    const config = this.configs.get(configName);
    
    if (!config) {
      throw new Error(`Config '${configName}' not found`);
    }

    if (nestedPath.length === 0) {
      throw new Error('Cannot set root config value');
    }

    this.setNestedValue(config, nestedPath, value);
  }

  private setNestedValue(obj: any, path: string[], value: ShinyConfigValue): void {
    let current = obj;
    
    // Navigate to the parent of the target
    for (let i = 0; i < path.length - 1; i++) {
      const key = path[i];
      if (!(key in current) || typeof current[key] !== 'object') {
        current[key] = {};
      }
      current = current[key];
    }
    
    // Set the value
    current[path[path.length - 1]] = value;
  }

  // Get all config names
  getConfigNames(): string[] {
    if (!this.loaded) {
      throw new Error('Configurations not loaded. Call loadAllConfigs() first.');
    }
    return Array.from(this.configs.keys());
  }

  // Check if a config exists
  hasConfig(configName: string): boolean {
    if (!this.loaded) {
      throw new Error('Configurations not loaded. Call loadAllConfigs() first.');
    }
    return this.configs.has(configName);
  }

  // Reload all configs (useful for development)
  async reload(): Promise<void> {
    this.configs.clear();
    this.loaded = false;
    await this.loadAllConfigs();
  }

  // Export configs as JSON (useful for debugging)
  exportAsJSON(): string {
    if (!this.loaded) {
      throw new Error('Configurations not loaded. Call loadAllConfigs() first.');
    }
    
    const exportData: { [key: string]: ShinyConfig } = {};
    for (const [name, config] of this.configs) {
      exportData[name] = config;
    }
    
    return JSON.stringify(exportData, null, 2);
  }
}

// Export singleton instance
export const shinyConfig = new DynamicShinyConfigLoader();

// Export utility functions
export const loadShinyConfigs = () => shinyConfig.loadAllConfigs();
export const getShinyConfig = (name: string) => shinyConfig.getConfig(name);
export const getShinyValue = (path: string) => shinyConfig.getValue(path);
export const setShinyValue = (path: string, value: ShinyConfigValue) => shinyConfig.setValue(path, value);
export const getAllShinyConfigs = () => shinyConfig.getAllConfigs();
export const getShinyConfigNames = () => shinyConfig.getConfigNames();
export const hasShinyConfig = (name: string) => shinyConfig.hasConfig(name);
export const reloadShinyConfigs = () => shinyConfig.reload();
export const exportShinyConfigs = () => shinyConfig.exportAsJSON();
