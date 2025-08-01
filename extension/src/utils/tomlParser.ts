import { ConfigFile, ConfigSection, ConfigValue } from '../types/config';

export function parseTomlContent(content: string, fileName: string = 'config'): ConfigFile {
  const lines = content.split('\n');
  const sections: ConfigSection[] = [];
  const topLevelValues: ConfigValue[] = [];
  let currentSection: ConfigSection | null = null;
  let currentSubsection: ConfigSection | null = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Skip empty lines
    if (!line) continue;

    // Handle comments
    if (line.startsWith('#')) {
      const comment = line.substring(1).trim();
      if (currentSection) {
        currentSection.comment = comment;
      } else {
        topLevelValues.push({
          type: 'comment',
          comment: comment,
          key: '',
          value: '',
          path: ''
        });
      }
      continue;
    }

    // Handle section headers [section]
    if (line.startsWith('[') && line.endsWith(']')) {
      const sectionName = line.slice(1, -1);
      const parts = sectionName.split('.');
      
      if (parts.length === 1) {
        // Main section
        currentSection = {
          name: parts[0],
          path: parts[0],
          values: [],
          subsections: [],
          comment: ''
        };
        sections.push(currentSection);
        currentSubsection = null;
      } else if (parts.length === 2) {
        // Subsection
        const mainSectionName = parts[0];
        const subsectionName = parts[1];
        
        // Find or create main section
        let mainSection = sections.find(s => s.name === mainSectionName);
        if (!mainSection) {
          mainSection = {
            name: mainSectionName,
            path: mainSectionName,
            values: [],
            subsections: [],
            comment: ''
          };
          sections.push(mainSection);
        }
        
        currentSubsection = {
          name: subsectionName,
          path: `${mainSectionName}.${subsectionName}`,
          values: [],
          subsections: [],
          comment: ''
        };
        mainSection.subsections.push(currentSubsection);
        currentSection = null;
      }
      continue;
    }

    // Handle key-value pairs
    if (line.includes('=')) {
      const [key, ...valueParts] = line.split('=');
      const trimmedKey = key.trim();
      const value = valueParts.join('=').trim();
      
      // Remove quotes if present
      const cleanValue = value.replace(/^["']|["']$/g, '');
      
      // Determine value type
      let type: 'string' | 'number' | 'boolean' | 'array' = 'string';
      let parsedValue: any = cleanValue;
      
      if (cleanValue === 'true' || cleanValue === 'false') {
        type = 'boolean';
        parsedValue = cleanValue === 'true';
      } else if (!isNaN(Number(cleanValue)) && cleanValue !== '') {
        type = 'number';
        parsedValue = Number(cleanValue);
      } else if (cleanValue.startsWith('[') && cleanValue.endsWith(']')) {
        type = 'array';
        parsedValue = cleanValue.slice(1, -1).split(',').map(v => v.trim().replace(/["']/g, ''));
      }
      
      const configValue: ConfigValue = {
        type,
        key: trimmedKey,
        value: parsedValue,
        path: currentSubsection ? `${currentSubsection.path}.${trimmedKey}` : 
              currentSection ? `${currentSection.path}.${trimmedKey}` : trimmedKey
      };
      
      if (currentSubsection) {
        currentSubsection.values.push(configValue);
      } else if (currentSection) {
        currentSection.values.push(configValue);
      } else {
        topLevelValues.push(configValue);
      }
    }
  }

  return {
    name: fileName,
    path: '',
    content: content,
    sections: sections,
    topLevelValues: topLevelValues
  };
}

export function configToFormFields(config: ConfigFile): any {
  const formData: any = {};
  
  // Add top-level values
  config.topLevelValues.forEach(value => {
    if (value.type !== 'comment' && value.key) {
      formData[value.key] = value.value;
    }
  });
  
  // Add section values
  config.sections.forEach(section => {
    section.values.forEach(value => {
      if (value.path) {
        formData[value.path] = value.value;
      }
    });
    
    section.subsections.forEach(subsection => {
      subsection.values.forEach(value => {
        if (value.path) {
          formData[value.path] = value.value;
        }
      });
    });
  });
  
  return formData;
}

export function formDataToToml(formData: any): string {
  const lines: string[] = [];
  
  Object.entries(formData).forEach(([path, value]) => {
    const parts = path.split('.');
    if (parts.length === 1) {
      // Top-level value
      lines.push(`${parts[0]} = ${formatValue(value)}`);
    } else if (parts.length === 2) {
      // Section value
      lines.push(`[${parts[0]}]`);
      lines.push(`${parts[1]} = ${formatValue(value)}`);
    } else if (parts.length === 3) {
      // Subsection value
      lines.push(`[${parts[0]}.${parts[1]}]`);
      lines.push(`${parts[2]} = ${formatValue(value)}`);
    }
  });
  
  return lines.join('\n');
}

function formatValue(value: any): string {
  if (typeof value === 'string') {
    return `"${value}"`;
  } else if (typeof value === 'boolean') {
    return value.toString();
  } else if (Array.isArray(value)) {
    return `[${value.map(v => typeof v === 'string' ? `"${v}"` : v).join(', ')}]`;
  }
  return value.toString();
} 