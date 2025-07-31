import React, { useEffect, useState } from 'react';
import { Dithering, ditheringPresets } from '@paper-design/shaders-react';

interface PaperShaderBackgroundProps {
  className?: string;
  startPixelSize?: number; // Starting pixel size (massive pixels)
  peakPixelSize?: number;  // Peak pixel size (small pixels)
}

export function PaperShaderBackground({ 
  className = '', 
  startPixelSize = 10.0,  // Massive pixels to start
  peakPixelSize = 2.0    // Small pixels at peak
}: PaperShaderBackgroundProps) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  
  // Find the sphere preset
  const spherePreset = ditheringPresets.find(preset => preset.name === 'Sphere') || ditheringPresets[0];
  
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      // Calculate when to start showing the shader (earlier trigger)
      const shinyStackStart = windowHeight * 0.2; // Start sooner (was 1.5)
      const shinyStackEnd = windowHeight * 2.0; // End sooner (was 3)
      
      if (scrollY >= shinyStackStart) {
        setIsVisible(true);
        
        // Calculate progress through the shiny stack section
        const sectionProgress = Math.min(
          (scrollY - shinyStackStart) / (shinyStackEnd - shinyStackStart),
          1
        );
        setScrollProgress(sectionProgress);
      } else {
        setIsVisible(false);
        setScrollProgress(0);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial call

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Calculate animation values based on scroll progress
  const translateY = isVisible ? -50 + (scrollProgress * 100) : -100; // Start above, move down
  const pxSize = isVisible ? startPixelSize - (scrollProgress * (startPixelSize - peakPixelSize)) : startPixelSize; // Massive to small pixels
  const opacity = isVisible ? 0.3 + (scrollProgress * 0.6) : 0; // Fade in gradually

  return (
    <div 
      className={`paper-shader-background ${className}`}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -1,
        pointerEvents: 'none',
        transform: `translateY(${translateY}vh)`,
        opacity: opacity,
        transition: 'transform 0.1s ease-out, opacity 0.1s ease-out'
      }}
    >
      <Dithering
        shape="sphere"
        type="4x4"
        pxSize={pxSize} // Animate pixel size for diffusion effect
        speed={1}
        colorBack={'#ffffff'} // White background
        colorFront={'#4E48EC'} // Brand green for the dithering
        style={{
          width: '100%',
          height: '100%',
          opacity: 0.9
        }}
      />
    </div>
  );
} 