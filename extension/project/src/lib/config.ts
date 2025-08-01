// Config loader for TOML configuration files
export interface StylesConfig {
  text: {
    primary: string;
    secondary: string;
  };
  components: {
    button: {
      primary: string;
    };
    button_radius: number;
    input_radius: number;
    card_shadow: string;
  };
  chat: {
    panel: {
      background: string;
    };
    input: {
      background: string;
      border: string;
      focus: string;
    };
    suggestions: {
      background: string;
      border: string;
      hover: string;
    };
  };
  borders: {
    default: string;
  };
  typography: {
    font_family: string;
    font_size: number;
    line_height: number;
  };
  layout: {
    sidebar_width: number;
    content_max_width: number;
    spacing_unit: number;
  };
  animations: {
    enable_animations: boolean;
    transition_duration: number;
    easing_function: string;
  };
}

// Default styles configuration
export const defaultStylesConfig: StylesConfig = {
  text: {
    primary: "text-stone-900",
    secondary: "text-stone-600",
  },
  components: {
    button: {
      primary: "bg-blue-600 hover:bg-blue-700 text-white",
    },
    button_radius: 6,
    input_radius: 4,
    card_shadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
  },
  chat: {
    panel: {
      background: "bg-white",
    },
    input: {
      background: "bg-white",
      border: "border-stone-300",
      focus: "focus:border-stone-400 focus:ring-stone-400",
    },
    suggestions: {
      background: "bg-stone-50",
      border: "border-stone-200",
      hover: "hover:bg-stone-100",
    },
  },
  borders: {
    default: "border-stone-200",
  },
  typography: {
    font_family: "Inter",
    font_size: 14,
    line_height: 1.5,
  },
  layout: {
    sidebar_width: 280,
    content_max_width: 1200,
    spacing_unit: 8,
  },
  animations: {
    enable_animations: true,
    transition_duration: 200,
    easing_function: "ease-in-out",
  },
};

// Parse TOML-like configuration (simplified parser)
function parseConfig(content: string): any {
  const lines = content.split('\n');
  const config: any = {};
  let currentSection: any = null;
  
  for (const line of lines) {
    const trimmed = line.trim();
    
    // Skip comments and empty lines
    if (trimmed.startsWith('#') || trimmed === '') continue;
    
    // Section header
    if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
      const sectionName = trimmed.slice(1, -1);
      config[sectionName] = {};
      currentSection = config[sectionName];
      continue;
    }
    
    // Key-value pair
    if (trimmed.includes('=') && currentSection) {
      const [key, value] = trimmed.split('=').map(s => s.trim());
      const cleanKey = key.replace(/^#\s*/, '');
      
      // Parse value based on type
      let parsedValue: any = value;
      
      // Remove quotes if present
      if (value.startsWith('"') && value.endsWith('"')) {
        parsedValue = value.slice(1, -1);
      } else if (value === 'true') {
        parsedValue = true;
      } else if (value === 'false') {
        parsedValue = false;
      } else if (!isNaN(Number(value))) {
        parsedValue = Number(value);
      }
      
      currentSection[cleanKey] = parsedValue;
    }
  }
  
  return config;
}

// Load styles configuration
export function loadStylesConfig(): StylesConfig {
  try {
    // In a real app, you'd load this from a file or API
    // For now, we'll use the default config
    return defaultStylesConfig;
  } catch (error) {
    console.warn('Failed to load styles config, using defaults:', error);
    return defaultStylesConfig;
  }
}

// Export the styles config for use in components
export const stylesConfig = loadStylesConfig(); 