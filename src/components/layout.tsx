import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="layout">
      <div className="layout-frame">
        {children}
      </div>
    </div>
  );
} 