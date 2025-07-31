export class TomlFormGenerator {
  private currentPath: string[] = [];

  async generateForm(tomlData: any, filePath: string): Promise<string> {
    this.currentPath = [];
    
    // Determine form structure based on file type
    const formConfig = this.getFormConfig(filePath);
    
    let html = `
      <div class="form-sections">
        ${this.generateFormSections(tomlData, formConfig)}
      </div>
    `;

    return html;
  }

  private getFormConfig(filePath: string): FormConfig {
    // Different form layouts based on file type
    if (filePath.includes('ai.config')) {
      return {
        title: 'AI Configuration',
        sections: [
          { key: 'model', title: '🤖 Models & Providers', icon: '🤖' },
          { key: 'mode', title: '⚙️ AI Modes', icon: '⚙️' },
          { key: 'agent', title: '👤 Custom Agents', icon: '👤' },
          { key: 'mcp', title: '🔌 MCP Servers', icon: '🔌' }
        ]
      };
    } else if (filePath.includes('styles.config')) {
      return {
        title: 'Styles Configuration',
        sections: [
          { key: 'theme', title: '🎨 Theme Settings', icon: '🎨' },
          { key: 'keybinds', title: '⌨️ Keybindings', icon: '⌨️' },
          { key: 'components', title: '🧩 Component Styles', icon: '🧩' },
          { key: 'colors', title: '🌈 Color Overrides', icon: '🌈' }
        ]
      };
    } else if (filePath.includes('architecture.config')) {
      return {
        title: 'Architecture Configuration',
        sections: [
          { key: 'stack', title: '📚 Tech Stack', icon: '📚' },
          { key: 'backend', title: '🖥️ Backend Config', icon: '🖥️' },
          { key: 'patterns', title: '🏗️ Architecture Patterns', icon: '🏗️' },
          { key: 'deployment', title: '🚀 Deployment', icon: '🚀' }
        ]
      };
    }
    
    // Default generic form
    return {
      title: 'Configuration',
      sections: []
    };
  }

  private generateFormSections(data: any, config: FormConfig): string {
    let html = '';

    if (config.sections.length > 0) {
      // Organized sections
      for (const section of config.sections) {
        if (data[section.key]) {
          html += `
            <div class="form-section" data-section="${section.key}">
              <div class="section-header">
                <span class="section-icon">${section.icon}</span>
                <h2 class="section-title">${section.title}</h2>
                <button class="section-toggle" data-section="${section.key}">−</button>
              </div>
              <div class="section-content" id="section-${section.key}">
                ${this.generateFieldsForObject(data[section.key], [section.key])}
              </div>
            </div>
          `;
        }
      }

      // Remaining fields not in sections
      const sectionKeys = config.sections.map(s => s.key);
      const remainingData = Object.keys(data)
        .filter(key => !sectionKeys.includes(key))
        .reduce((obj, key) => ({ ...obj, [key]: data[key] }), {});

      if (Object.keys(remainingData).length > 0) {
        html += `
          <div class="form-section" data-section="general">
            <div class="section-header">
              <span class="section-icon">⚙️</span>
              <h2 class="section-title">General Settings</h2>
              <button class="section-toggle" data-section="general">−</button>
            </div>
            <div class="section-content" id="section-general">
              ${this.generateFieldsForObject(remainingData, [])}
            </div>
          </div>
        `;
      }
    } else {
      // No sections, generate flat form
      html += this.generateFieldsForObject(data, []);
    }

    return html;
  }

  private generateFieldsForObject(obj: any, path: string[]): string {
    let html = '';

    for (const [key, value] of Object.entries(obj)) {
      const fieldPath = [...path, key];
      const fieldId = fieldPath.join('.');
      
      html += `<div class="form-field" data-field="${fieldId}">`;
      html += this.generateField(key, value, fieldPath);
      html += `</div>`;
    }

    return html;
  }

  private generateField(key: string, value: any, path: string[]): string {
    const fieldId = path.join('.');
    const label = this.formatLabel(key);
    
    if (typeof value === 'string') {
      return this.generateStringField(fieldId, label, value, key);
    } else if (typeof value === 'number') {
      return this.generateNumberField(fieldId, label, value, key);
    } else if (typeof value === 'boolean') {
      return this.generateBooleanField(fieldId, label, value);
    } else if (Array.isArray(value)) {
      return this.generateArrayField(fieldId, label, value);
    } else if (typeof value === 'object' && value !== null) {
      return this.generateObjectField(fieldId, label, value, path);
    }
    
    return '';
  }

  private generateStringField(fieldId: string, label: string, value: string, key: string): string {
    // Detect field types based on key names and values
    if (key.toLowerCase().includes('password') || key.toLowerCase().includes('secret') || key.toLowerCase().includes('key')) {
      return this.generatePasswordField(fieldId, label, value);
    } else if (key.toLowerCase().includes('email')) {
      return this.generateEmailField(fieldId, label, value);
    } else if (key.toLowerCase().includes('url') || value.startsWith('http')) {
      return this.generateUrlField(fieldId, label, value);
    } else if (value.includes('\n') || key.toLowerCase().includes('prompt') || key.toLowerCase().includes('description')) {
      return this.generateTextareaField(fieldId, label, value);
    } else if (this.isSelectField(key, value)) {
      return this.generateSelectField(fieldId, label, value, key);
    }
    
    return this.generateTextInputField(fieldId, label, value);
  }

  private generateTextInputField(fieldId: string, label: string, value: string): string {
    return `
      <div class="field-group">
        <label class="field-label" for="${fieldId}">${label}</label>
        <input 
          type="text" 
          id="${fieldId}" 
          name="${fieldId}"
          class="form-input" 
          value="${this.escapeHtml(value)}"
          data-type="string"
        />
        <div class="field-description"></div>
      </div>
    `;
  }

  private generatePasswordField(fieldId: string, label: string, value: string): string {
    return `
      <div class="field-group">
        <label class="field-label" for="${fieldId}">${label}</label>
        <div class="password-field">
          <input 
            type="password" 
            id="${fieldId}" 
            name="${fieldId}"
            class="form-input password-input" 
            value="${this.escapeHtml(value)}"
            data-type="string"
            placeholder="Enter ${label.toLowerCase()}"
          />
          <button type="button" class="password-toggle" data-target="${fieldId}">👁️</button>
        </div>
        <div class="field-description">Keep your API keys secure</div>
      </div>
    `;
  }

  private generateEmailField(fieldId: string, label: string, value: string): string {
    return `
      <div class="field-group">
        <label class="field-label" for="${fieldId}">${label}</label>
        <input 
          type="email" 
          id="${fieldId}" 
          name="${fieldId}"
          class="form-input" 
          value="${this.escapeHtml(value)}"
          data-type="string"
        />
      </div>
    `;
  }

  private generateUrlField(fieldId: string, label: string, value: string): string {
    return `
      <div class="field-group">
        <label class="field-label" for="${fieldId}">${label}</label>
        <input 
          type="url" 
          id="${fieldId}" 
          name="${fieldId}"
          class="form-input" 
          value="${this.escapeHtml(value)}"
          data-type="string"
          placeholder="https://"
        />
      </div>
    `;
  }

  private generateTextareaField(fieldId: string, label: string, value: string): string {
    const rows = Math.min(Math.max(value.split('\n').length + 1, 3), 10);
    return `
      <div class="field-group">
        <label class="field-label" for="${fieldId}">${label}</label>
        <textarea 
          id="${fieldId}" 
          name="${fieldId}"
          class="form-textarea" 
          rows="${rows}"
          data-type="string"
        >${this.escapeHtml(value)}</textarea>
        <div class="field-description">Multi-line text input</div>
      </div>
    `;
  }

  private generateSelectField(fieldId: string, label: string, value: string, key: string): string {
    const options = this.getSelectOptions(key);
    let optionsHtml = '';
    
    for (const option of options) {
      const selected = option.value === value ? 'selected' : '';
      optionsHtml += `<option value="${option.value}" ${selected}>${option.label}</option>`;
    }

    return `
      <div class="field-group">
        <label class="field-label" for="${fieldId}">${label}</label>
        <select 
          id="${fieldId}" 
          name="${fieldId}"
          class="form-select" 
          data-type="string"
        >
          ${optionsHtml}
        </select>
      </div>
    `;
  }

  private generateNumberField(fieldId: string, label: string, value: number, key: string): string {
    // Detect if it's a slider field (temperature, etc.)
    if (this.isSliderField(key, value)) {
      return this.generateSliderField(fieldId, label, value, key);
    }

    return `
      <div class="field-group">
        <label class="field-label" for="${fieldId}">${label}</label>
        <input 
          type="number" 
          id="${fieldId}" 
          name="${fieldId}"
          class="form-input" 
          value="${value}"
          data-type="number"
          ${this.getNumberConstraints(key)}
        />
      </div>
    `;
  }

  private generateSliderField(fieldId: string, label: string, value: number, key: string): string {
    const constraints = this.getSliderConstraints(key);
    return `
      <div class="field-group">
        <label class="field-label" for="${fieldId}">
          ${label}
          <span class="slider-value" id="${fieldId}-value">${value}</span>
        </label>
        <div class="slider-container">
          <input 
            type="range" 
            id="${fieldId}" 
            name="${fieldId}"
            class="form-slider" 
            value="${value}"
            min="${constraints.min}"
            max="${constraints.max}"
            step="${constraints.step}"
            data-type="number"
          />
          <div class="slider-labels">
            <span>${constraints.min}</span>
            <span>${constraints.max}</span>
          </div>
        </div>
        <div class="field-description">${constraints.description}</div>
      </div>
    `;
  }

  private generateBooleanField(fieldId: string, label: string, value: boolean): string {
    const checked = value ? 'checked' : '';
    return `
      <div class="field-group">
        <div class="checkbox-wrapper">
          <input 
            type="checkbox" 
            id="${fieldId}" 
            name="${fieldId}"
            class="form-checkbox" 
            ${checked}
            data-type="boolean"
          />
          <label class="checkbox-label" for="${fieldId}">${label}</label>
        </div>
      </div>
    `;
  }

  private generateArrayField(fieldId: string, label: string, value: any[]): string {
    let itemsHtml = '';
    
    value.forEach((item, index) => {
      const itemId = `${fieldId}.${index}`;
      itemsHtml += `
        <div class="array-item" data-index="${index}">
          <input 
            type="text" 
            id="${itemId}" 
            name="${itemId}"
            class="form-input array-input" 
            value="${this.escapeHtml(String(item))}"
            data-type="array-item"
          />
          <button type="button" class="array-remove" data-array="${fieldId}" data-index="${index}">×</button>
        </div>
      `;
    });

    return `
      <div class="field-group">
        <label class="field-label">${label}</label>
        <div class="array-container" data-field="${fieldId}">
          ${itemsHtml}
          <button type="button" class="array-add" data-array="${fieldId}">+ Add Item</button>
        </div>
      </div>
    `;
  }

  private generateObjectField(fieldId: string, label: string, value: any, path: string[]): string {
    return `
      <div class="field-group object-field">
        <div class="object-header">
          <label class="field-label object-label">${label}</label>
          <button type="button" class="object-toggle" data-target="${fieldId}">−</button>
        </div>
        <div class="object-content" id="object-${fieldId}">
          ${this.generateFieldsForObject(value, path)}
        </div>
      </div>
    `;
  }

  // Helper methods
  private formatLabel(key: string): string {
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .replace(/_/g, ' ');
  }

  private escapeHtml(text: string): string {
    // Simple HTML escaping for server-side rendering
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  private isSelectField(key: string, value: string): boolean {
    const selectFields = [
      'theme', 'provider', 'model', 'runtime', 'framework',
      'hosting_platform', 'backend_platform', 'styling_approach'
    ];
    return selectFields.some(field => key.toLowerCase().includes(field));
  }

  private isSliderField(key: string, value: number): boolean {
    return key.toLowerCase().includes('temperature') || 
           (key.toLowerCase().includes('limit') && value <= 10) ||
           (key.toLowerCase().includes('coverage') && value <= 100);
  }

  private getSelectOptions(key: string): Array<{value: string, label: string}> {
    const optionsMap: Record<string, Array<{value: string, label: string}>> = {
      theme: [
        { value: 'opencode', label: 'OpenCode' },
        { value: 'nord', label: 'Nord' },
        { value: 'dracula', label: 'Dracula' },
        { value: 'github', label: 'GitHub' },
        { value: 'one-dark', label: 'One Dark' }
      ],
      provider: [
        { value: 'anthropic', label: 'Anthropic' },
        { value: 'openai', label: 'OpenAI' },
        { value: 'google', label: 'Google' }
      ],
      framework: [
        { value: 'vite', label: 'Vite' },
        { value: 'astro', label: 'Astro' },
        { value: 'solid', label: 'Solid' }
      ]
    };

    return optionsMap[key.toLowerCase()] || [{ value: '', label: 'Select...' }];
  }

  private getSliderConstraints(key: string): SliderConstraints {
    if (key.toLowerCase().includes('temperature')) {
      return {
        min: 0,
        max: 1,
        step: 0.1,
        description: 'Controls randomness: 0 = focused, 1 = creative'
      };
    }
    
    return { min: 0, max: 100, step: 1, description: '' };
  }

  private getNumberConstraints(key: string): string {
    if (key.toLowerCase().includes('port')) {
      return 'min="1" max="65535"';
    }
    if (key.toLowerCase().includes('timeout')) {
      return 'min="0"';
    }
    return '';
  }
}

interface FormConfig {
  title: string;
  sections: Array<{
    key: string;
    title: string;
    icon: string;
  }>;
}

interface SliderConstraints {
  min: number;
  max: number;
  step: number;
  description: string;
}