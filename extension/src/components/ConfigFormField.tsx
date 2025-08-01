import React from 'react';
import { ConfigValue } from '../types/config';

interface ConfigFormFieldProps {
  field: ConfigValue;
  onChange: (path: string, value: any) => void;
}

export const ConfigFormField: React.FC<ConfigFormFieldProps> = ({ field, onChange }) => {
  const handleChange = (value: any) => {
    const path = field.path || field.key || '';
    onChange(path, value);
  };

  // Render comments
  if (field.type === 'comment') {
    return (
      <div className="comment-text">
        {field.comment}
      </div>
    );
  }

  // Detect if this is a color field
  const isColorField = field.key?.toLowerCase().includes('color') || 
                      (typeof field.value === 'string' && field.value.startsWith('#'));

  // Detect if this is a percentage or slider field
  const isSliderField = field.key?.toLowerCase().includes('opacity') || 
                       field.key?.toLowerCase().includes('alpha') ||
                       field.key?.toLowerCase().includes('scale') ||
                       field.key?.toLowerCase().includes('size') ||
                       (typeof field.value === 'number' && field.value >= 0 && field.value <= 1);

  // Render color picker
  if (isColorField && typeof field.value === 'string') {
    return (
      <div className="form-field">
        <label className="field-label">{field.key}</label>
        <div className="color-input-container">
          <input
            type="color"
            className="color-picker"
            value={field.value}
            onChange={(e) => handleChange(e.target.value)}
          />
          <input
            type="text"
            className="field-input color-text-input"
            value={field.value}
            onChange={(e) => handleChange(e.target.value)}
            placeholder="#000000"
          />
        </div>
      </div>
    );
  }

  // Render slider
  if (isSliderField && typeof field.value === 'number') {
    const min = field.value >= 0 && field.value <= 1 ? 0 : 0;
    const max = field.value >= 0 && field.value <= 1 ? 1 : 100;
    const step = field.value >= 0 && field.value <= 1 ? 0.01 : 1;
    
    return (
      <div className="form-field">
        <label className="field-label">{field.key}</label>
        <div className="slider-container">
          <input
            type="range"
            className="slider-input"
            min={min}
            max={max}
            step={step}
            value={field.value}
            onChange={(e) => handleChange(Number(e.target.value))}
          />
          <input
            type="number"
            className="slider-number-input"
            min={min}
            max={max}
            step={step}
            value={field.value}
            onChange={(e) => handleChange(Number(e.target.value))}
          />
        </div>
      </div>
    );
  }

  // Render boolean values as switches
  if (field.type === 'boolean') {
    return (
      <div className="switch-container">
        <label className="field-label">{field.key}</label>
        <div 
          className="switch"
          data-state={field.value ? "checked" : "unchecked"}
          onClick={() => handleChange(!field.value)}
        >
          <div className="switch-thumb"></div>
        </div>
      </div>
    );
  }

  // Render number values
  if (field.type === 'number') {
    return (
      <div className="form-field">
        <label className="field-label">{field.key}</label>
        <input
          type="number"
          className="field-input"
          value={field.value}
          onChange={(e) => handleChange(Number(e.target.value))}
        />
      </div>
    );
  }

  // Render array values as textarea
  if (field.type === 'array') {
    const arrayText = Array.isArray(field.value) ? field.value.join(', ') : field.value;
    return (
      <div className="form-field">
        <label className="field-label">{field.key}</label>
        <textarea
          className="field-input field-textarea"
          value={arrayText}
          onChange={(e) => {
            const values = e.target.value.split(',').map(v => v.trim()).filter(v => v);
            handleChange(values);
          }}
          placeholder="Enter values separated by commas"
        />
      </div>
    );
  }

  // Render multi-line strings as textarea
  if (field.type === 'string' && typeof field.value === 'string' && field.value.includes('\n')) {
    return (
      <div className="form-field">
        <label className="field-label">{field.key}</label>
        <textarea
          className="field-input field-textarea"
          value={field.value}
          onChange={(e) => handleChange(e.target.value)}
        />
      </div>
    );
  }

  // Default: render as text input
  return (
    <div className="form-field">
      <label className="field-label">{field.key}</label>
      <input
        type="text"
        className="field-input"
        value={field.value}
        onChange={(e) => handleChange(e.target.value)}
      />
    </div>
  );
}; 