import React from 'react';
import ReactDOM from 'react-dom/client';
import { ConfigEditor } from './components/ConfigEditor';

// Get the acquireVsCodeApi function
declare global {
  interface Window {
    acquireVsCodeApi: () => {
      postMessage: (message: any) => void;
      getState: () => any;
      setState: (state: any) => void;
    };
    vscode?: any;
  }
}

// Initialize VS Code API
let vscode: any;
try {
  vscode = window.acquireVsCodeApi();
  window.vscode = vscode;
} catch (error) {
  console.error('Failed to acquire VS Code API:', error);
  // Create a mock API for development
  vscode = {
    postMessage: (message: any) => console.log('Mock postMessage:', message),
    getState: () => ({}),
    setState: (state: any) => console.log('Mock setState:', state)
  };
}

// Initialize the React app
document.addEventListener('DOMContentLoaded', async () => {
  const container = document.getElementById('root');
  if (!container) return;

  // Create React root
  const root = ReactDOM.createRoot(container);

  // State for config files
  let configFiles: { name: string; content: string }[] = [];

  // Handle messages from the extension
  window.addEventListener('message', (event) => {
    try {
      const message = event.data;
      switch (message.type) {
        case 'configFilesLoaded':
          configFiles = message.configFiles || [];
          renderApp();
          break;
        case 'configFileSaved':
          console.log(`Config file ${message.fileName} saved successfully`);
          break;
        case 'error':
          console.error('Error:', message.message);
          break;
        default:
          console.log('Unknown message type:', message.type);
      }
    } catch (error) {
      console.error('Error handling message:', error);
    }
  });

  // Handle save functionality
  const handleSave = async (fileName: string, content: string) => {
    try {
      vscode.postMessage({
        type: 'saveConfigFile',
        fileName,
        content
      });
    } catch (error) {
      console.error('Error sending save message:', error);
    }
  };

  // Render function
  const renderApp = () => {
    root.render(
      <React.StrictMode>
        <div className="config-editor-app">
          <ConfigEditor 
            configFiles={configFiles} 
            onSave={handleSave}
          />
        </div>
      </React.StrictMode>
    );
  };

  // Request config files from the extension
  try {
    vscode.postMessage({ type: 'loadConfigFiles' });
  } catch (error) {
    console.error('Error requesting config files:', error);
  }

  // Initial render with empty configs
  renderApp();
});
