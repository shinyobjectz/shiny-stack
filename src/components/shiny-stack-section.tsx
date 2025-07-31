import React from 'react';
import { Copy, Terminal, Sparkles, ArrowRight, CheckCircle, Play } from 'lucide-react';
import { OrbitingCircles } from '@/components/magicui/orbiting-circles';
import { LiquidMetalObject } from '@/components/liquid-metal-object';

export function ShinyStackSection() {
  const techStack = [
    { name: 'Vite', logo: '⚡' },
    { name: 'React', logo: '⚛️' },
    { name: 'Convex', logo: '🔺' },
    { name: 'Composio', logo: '🔧' },
    { name: 'TypeScript', logo: '📘' },
    { name: 'Tailwind', logo: '🎨' },
    { name: 'Shadcn/ui', logo: '🎭' },
    { name: 'Framer Motion', logo: '🎬' },
  ];

  const copyCommand = () => {
    navigator.clipboard.writeText('npm create shiny-stack@latest');
  };

  return (
    <section className="shiny-stack-section">
      <div className="section-container">
        <div className="stack-hero">
          {/* Left Side - Glassmorphic Card */}
          <div className="stack-content-wrapper">
            <div className="glassmorphic-card">
              <div className="stack-content">
                <div className="stack-badge">
                  <span className="badge-text">Open Source</span>
                  <div className="badge-shine"></div>
                </div>
                <h2 className="stack-title">Shiny Stack</h2>
                <p className="stack-description">
                  The modern full-stack framework that brings together the best tools 
                  for building lightning-fast, elegant applications.
                </p>
                
                <div className="tech-badges">
                  {techStack.map((tech, index) => (
                    <div 
                      key={tech.name} 
                      className="tech-badge"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <span className="badge-name">{tech.name}</span>
                    </div>
                  ))}
                </div>
                
                <div className="command-container">
                  <div className="command-box">
                    <div className="command-content">
                      <span className="command-prompt">$</span>
                      <span className="command-text">npm create shiny-stack@latest</span>
                      <button className="copy-button" onClick={copyCommand}>
                        <Copy size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Side - Terminal Widget */}
          <div className="terminal-widget">
            <div className="terminal-header">
              <div className="terminal-controls">
                <div className="control close"></div>
                <div className="control minimize"></div>
                <div className="control maximize"></div>
              </div>
              <div className="terminal-title">shiny-stack-cli</div>
            </div>
            
            <div className="terminal-body">
              <div className="terminal-line">
                <span className="prompt">$</span>
                <span className="command">npm create shiny-stack@latest</span>
              </div>
              
              <div className="terminal-output">
                <div className="output-line">
                  <span className="success">✓</span>
                  <span className="text">Creating a new Shiny Stack project...</span>
                </div>
                
                <div className="output-line">
                  <span className="info">⚡</span>
                  <span className="text">Installing dependencies...</span>
                </div>
                
                <div className="output-line">
                  <span className="success">✓</span>
                  <span className="text">Vite configured for lightning-fast development</span>
                </div>
                
                <div className="output-line">
                  <span className="success">✓</span>
                  <span className="text">React 19 with concurrent features enabled</span>
                </div>
                
                <div className="output-line">
                  <span className="success">✓</span>
                  <span className="text">Convex real-time database connected</span>
                </div>
                
                <div className="output-line">
                  <span className="success">✓</span>
                  <span className="text">TypeScript strict mode configured</span>
                </div>
                
                <div className="output-line">
                  <span className="success">✓</span>
                  <span className="text">Tailwind CSS with custom design system</span>
                </div>
                
                <div className="output-line">
                  <span className="success">✓</span>
                  <span className="text">Shadcn/ui components ready to use</span>
                </div>
                
                <div className="output-line">
                  <span className="success">✓</span>
                  <span className="text">Framer Motion animations configured</span>
                </div>
                
                <div className="welcome-message">
                  <div className="welcome-header">
                    <Sparkles className="sparkle-icon" />
                    <span className="welcome-title">Welcome to Shiny Stack!</span>
                  </div>
                  <p className="welcome-text">
                    Your project is ready! Start building something amazing with the modern stack.
                  </p>
                  <div className="welcome-actions">
                    <button className="action-btn primary">
                      <Play size={16} />
                      <span>Start Development</span>
                    </button>
                    <button className="action-btn secondary">
                      <ArrowRight size={16} />
                      <span>View Documentation</span>
                    </button>
                  </div>
                </div>
                
                <div className="terminal-line">
                  <span className="prompt">$</span>
                  <span className="command typing">cd my-shiny-app && npm run dev</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 