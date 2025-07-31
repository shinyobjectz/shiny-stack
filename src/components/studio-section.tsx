import React from 'react';
import { InteractiveHoverButton } from '@/components/magicui/interactive-hover-button';

export function StudioSection() {
  const applications = [
    {
      name: 'Subzero',
      description: 'Agentic finance platform for managing and unsubscribing to subscriptions with intelligent automation',
      image: '❄️',
      tech: ['React', 'AI', 'Convex', 'Composio'],
      status: 'Live'
    },
    {
      name: 'Playhead',
      description: 'AI-first non-linear editor that reimagines video editing with intelligent workflows',
      image: '▶️',
      tech: ['React', 'AI', 'WebGL', 'FFmpeg'],
      status: 'Development'
    }
  ];

  return (
    <section className="studio-section">
      <div className="section-container">
        <div className="section-header">
          <h2 className="section-title">Our Studio</h2>
          <p className="section-subtitle">
            Crafting digital experiences that push the boundaries of what's possible
          </p>
        </div>

                 <div className="applications-grid">
           {applications.map((app, index) => (
             <div 
               key={app.name} 
               className="app-card" 
               data-status={app.status.toLowerCase().replace(' ', '-')}
               style={{ animationDelay: `${index * 0.2}s` }}
             >
               <div className="app-header">
                 <div className="app-icon">{app.image}</div>
                 <div className="app-status" data-status={app.status.toLowerCase().replace(' ', '-')}>
                   {app.status}
                 </div>
               </div>
              <h3 className="app-name">{app.name}</h3>
              <p className="app-description">{app.description}</p>
              <div className="app-tech">
                {app.tech.map(tech => (
                  <span key={tech} className="tech-tag">{tech}</span>
                ))}
              </div>
                                            <div className="app-actions">
                 <InteractiveHoverButton 
                   className={app.status === 'Development' ? 'app-interactive-dev' : 'app-interactive-live'}
                 >
                   View Project
                 </InteractiveHoverButton>
               </div>
            </div>
          ))}
        </div>

        <div className="about-section">
          <div className="about-content">
            <div className="about-text">
              <h3 className="about-title">About Shiny Objectz</h3>
              <p className="about-description">
                We're a digital studio focused on creating cutting-edge user experiences 
                that stand the test of time. Our team combines technical expertise with 
                creative vision to build applications that not only function flawlessly 
                but inspire and delight users.
              </p>
              <p className="about-description">
                From liquid metal interfaces to scalable architectures, we chase the next 
                big thing in technology while maintaining a commitment to elegant design 
                and robust engineering.
              </p>
            </div>
            <div className="about-visual">
              <div className="about-sparkle">✨</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 