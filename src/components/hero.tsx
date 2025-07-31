import React from 'react';
import { LiquidMetalObject } from './liquid-metal-object';
import { InteractiveHoverButton } from '@/components/magicui/interactive-hover-button';
import type { ShaderParams } from '../hero/params';

interface HeroProps {
  currentEffect: number;
  effects: Partial<ShaderParams>[];
}

export function Hero({ currentEffect, effects }: HeroProps) {
  return (
    <section className="hero-section">
      <div className="hero-container">
        {/* Left Column - Content */}
        <div className="hero-content">
          <div className="hero-text-content">
                         <p className="hero-subtitle">
                <span className="shiny-text">Chasing the next big thing</span>
             </p>
            <h1 className="hero-title">
              Crafting Digital
              <br />
              <span className="hero-title-accent">Solutions</span>
              <br />
              That Last
            </h1>
            <p className="hero-description">
              Build fast. Build for everyone. Build for the future.
            </p>
                         <div className="hero-cta">
               <InteractiveHoverButton className="cta-primary-interactive">
                 Start With Shiny Stack
               </InteractiveHoverButton>
               <InteractiveHoverButton className="cta-secondary-interactive">
                 Our Studio
               </InteractiveHoverButton>
             </div>
          </div>
        </div>

        {/* Right Column - Visual */}
        <div className="hero-visual">
          <div className="liquid-metal-container">
            <LiquidMetalObject
              imageSrc="/sparkles_2728.png"
              width={500}
              height={500}
              params={effects[currentEffect]}
              style={{
                opacity: 0.9,
                maxWidth: '100%',
                height: 'auto'
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
} 