import React from 'react';
import { ConfigSection as ConfigSectionType, ConfigValue } from '../types/config';
import { ConfigFormField } from './ConfigFormField';

interface ConfigSectionProps {
  section: ConfigSectionType;
  onChange: (path: string, value: any) => void;
  headerLevel?: number;
}

export const ConfigSection: React.FC<ConfigSectionProps> = ({ 
  section, 
  onChange, 
  headerLevel = 2 
}) => {
  const renderHeader = (text: string, level: number) => {
    const HeaderTag = `h${Math.min(level + 1, 6)}` as keyof JSX.IntrinsicElements;
    return <HeaderTag className="subsection-header">{text}</HeaderTag>;
  };

  return (
    <div className="form-section">
      {renderHeader(section.name, headerLevel)}
      
      {/* Section comment */}
      {section.comment && (
        <div className="comment-text">
          {section.comment}
        </div>
      )}
      
      {/* Section values */}
      {section.values.map((value, index) => (
        <ConfigFormField
          key={`${section.path}-${value.key || index}`}
          field={value}
          onChange={onChange}
        />
      ))}

      {/* Subsections */}
      {section.subsections.map((subsection) => (
        <ConfigSection
          key={subsection.path}
          section={subsection}
          onChange={onChange}
          headerLevel={headerLevel + 1}
        />
      ))}
    </div>
  );
}; 