import React from 'react';
import { LiquidMetalObject } from './liquid-metal-object';
import { defaultParams } from '../hero/params';

export function Navigation() {
  return (
    <nav className="floating-navbar">
      <div className="floating-nav-container">
        <span className="logo-text-left">shiny</span>
        <div className="logo-icon-center">
          <LiquidMetalObject
            imageSrc="/sparkles_2728.png"
            width={40}
            height={40}
            params={defaultParams}
            style={{
              opacity: 0.9
            }}
          />
        </div>
        <span className="logo-text-right">objectz</span>
      </div>
    </nav>
  );
} 