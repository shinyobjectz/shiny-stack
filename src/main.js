import './style.css'
import React, { useState } from 'react'
import { createRoot } from 'react-dom/client'
import { createPortal } from 'react-dom'
import { Layout } from './components/layout'
import { Hero } from './components/hero'
import { Navigation } from './components/navigation'
import { ShinyStackSection } from './components/shiny-stack-section'
import { StudioSection } from './components/studio-section'
import { ScrollAnimations } from './components/scroll-animations'
import { PaperShaderBackground } from './components/paper-shader-background'
import type { ShaderParams } from './hero/params'

function App() {
  const [currentEffect] = useState<number>(3); // Effect 4 (index 3)
  
  const effects: Partial<ShaderParams>[] = [
    { patternScale: 1, refraction: 0.02, liquid: 0.1, speed: 0.5 },
    { patternScale: 3, refraction: 0.04, liquid: 0.3, speed: 0.8 },
    { patternScale: 5, refraction: 0.06, liquid: 0.5, speed: 1.2 },
    { patternScale: 2, refraction: 0.015, liquid: 0.07, speed: 0.3 } // Effect 4 - ShinyObjectz signature
  ];

  return (
    <>
      {createPortal(<Navigation />, document.body)}
      <PaperShaderBackground />
      <ScrollAnimations />
      <Layout>
        <Hero currentEffect={currentEffect} effects={effects} />
        
        {/* Scroll Indicator */}
        <div className="scroll-indicator">
          <div className="scroll-text">Scroll to explore</div>
          <div className="scroll-arrow">↓</div>
        </div>
      </Layout>
      
      <ShinyStackSection />
      <StudioSection />
    </>
  );
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('app');
  if (container) {
    const root = createRoot(container);
    root.render(<App />);
  }

  // Add keyboard controls
  document.addEventListener('keydown', (e) => {
    const key = parseInt(e.key);
    if (key >= 1 && key <= 4) {
      // The effect will be handled by the React component
      // We'll need to add a global state or event system
      console.log(`Effect ${key} requested`);
    }
  });
});
