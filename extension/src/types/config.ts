export interface ConfigValue {
  type: 'string' | 'number' | 'boolean' | 'array' | 'object' | 'comment' | 'section';
  value: any;
  key?: string;
  path?: string;
  comment?: string;
  section?: string;
}

export interface ConfigSection {
  name: string;
  path: string;
  values: ConfigValue[];
  subsections: ConfigSection[];
  comment?: string;
}

export interface ConfigFile {
  name: string;
  path: string;
  content: string;
  sections: ConfigSection[];
  topLevelValues: ConfigValue[];
}

export interface FormField {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'number' | 'boolean' | 'select' | 'color' | 'array' | 'object';
  value: any;
  path: string;
  comment?: string;
  options?: string[];
  placeholder?: string;
  required?: boolean;
}

export interface ConfigFormData {
  [key: string]: any;
} 