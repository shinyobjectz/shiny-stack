import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import * as toml from 'toml';
import { TomlFormGenerator } from './TomlFormGenerator';

interface WebviewMessage {
  command: string;
  data?: any;
}

export class TomlFormPanel {
  public static currentPanel: TomlFormPanel | undefined;
  public static readonly viewType = 'tomlFormEditor';

  private readonly _panel: vscode.WebviewPanel;
  private readonly _extensionUri: vscode.Uri;
  private _fileUri: vscode.Uri;
  private _disposables: vscode.Disposable[] = [];

  public static createOrShow(extensionUri: vscode.Uri, fileUri: vscode.Uri) {
    const column = vscode.window.activeTextEditor
      ? vscode.window.activeTextEditor.viewColumn
      : undefined;

    // If we already have a panel, show it and update the file
    if (TomlFormPanel.currentPanel) {
      TomlFormPanel.currentPanel._fileUri = fileUri;
      TomlFormPanel.currentPanel._panel.reveal(column);
      TomlFormPanel.currentPanel._update();
      return;
    }

    // Otherwise, create a new panel
    const panel = vscode.window.createWebviewPanel(
      TomlFormPanel.viewType,
      `Form Editor - ${path.basename(fileUri.fsPath)}`,
      column || vscode.ViewColumn.One,
      {
        enableScripts: true,
        retainContextWhenHidden: true,
        localResourceRoots: [extensionUri]
      }
    );

    TomlFormPanel.currentPanel = new TomlFormPanel(panel, extensionUri, fileUri);
  }

  public static refresh() {
    if (TomlFormPanel.currentPanel) {
      TomlFormPanel.currentPanel._update();
    }
  }

  public static dispose() {
    TomlFormPanel.currentPanel?.dispose();
    TomlFormPanel.currentPanel = undefined;
  }

  private constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri, fileUri: vscode.Uri) {
    this._panel = panel;
    this._extensionUri = extensionUri;
    this._fileUri = fileUri;

    // Set the webview's initial html content
    this._update();

    // Listen for when the panel is disposed (user closes the panel)
    this._panel.onDidDispose(() => this.dispose(), null, this._disposables);

    // Handle messages from the webview
    this._panel.webview.onDidReceiveMessage(
      async (message: WebviewMessage) => {
        switch (message.command) {
          case 'save':
            await this._saveTomlFile(message.data);
            return;
          case 'refresh':
            this._update();
            return;
        }
      },
      null,
      this._disposables
    );
  }

  public dispose() {
    TomlFormPanel.currentPanel = undefined;

    // Clean up our resources
    this._panel.dispose();

    while (this._disposables.length) {
      const x = this._disposables.pop();
      if (x) {
        x.dispose();
      }
    }
  }

  private async _update() {
    const webview = this._panel.webview;
    let tomlContent = '';
    
    try {
      // Read the TOML file
      tomlContent = fs.readFileSync(this._fileUri.fsPath, 'utf8');
      const tomlData = toml.parse(tomlContent);
      
      // Generate the form
      const formGenerator = new TomlFormGenerator();
      const formHtml = await formGenerator.generateForm(tomlData, this._fileUri.fsPath);
      
      this._panel.title = `Form Editor - ${path.basename(this._fileUri.fsPath)}`;
      this._panel.webview.html = this._getHtmlForWebview(webview, formHtml, tomlData);
      
    } catch (error) {
      const errorMessage = this._formatTomlError(error as Error);
      vscode.window.showErrorMessage(`TOML Syntax Error: ${errorMessage}`);
      this._panel.webview.html = this._getErrorHtml(error as Error, tomlContent);
    }
  }

  private async _saveTomlFile(formData: any) {
    try {
      // Convert form data back to TOML
      const tomlString = this._convertToToml(formData);
      
      // Write to file
      fs.writeFileSync(this._fileUri.fsPath, tomlString, 'utf8');
      
      // Show success message
      vscode.window.showInformationMessage(`Saved ${path.basename(this._fileUri.fsPath)}`);
      
      // Refresh any open text editors with this file
      const textDocument = await vscode.workspace.openTextDocument(this._fileUri);
      const editors = vscode.window.visibleTextEditors.filter(
        (editor: vscode.TextEditor) => editor.document.uri.toString() === this._fileUri.toString()
      );
      
      for (const editor of editors) {
        // Trigger a reload of the text editor
        await vscode.commands.executeCommand('workbench.action.files.revert');
      }
      
    } catch (error) {
      vscode.window.showErrorMessage(`Failed to save file: ${error}`);
    }
  }

  private _convertToToml(data: any): string {
    // Simple TOML serialization - in a real implementation you'd want a proper TOML serializer
    let result = '';
    
    const writeValue = (key: string, value: any, indent = '') => {
      if (typeof value === 'string') {
        if (value.includes('\n')) {
          result += `${indent}${key} = """\n${value}\n"""\n`;
        } else {
          result += `${indent}${key} = "${value}"\n`;
        }
      } else if (typeof value === 'number') {
        result += `${indent}${key} = ${value}\n`;
      } else if (typeof value === 'boolean') {
        result += `${indent}${key} = ${value}\n`;
      } else if (Array.isArray(value)) {
        result += `${indent}${key} = ${JSON.stringify(value)}\n`;
      }
    };

    const writeSection = (obj: any, path: string[] = []) => {
      // Write primitive values first
      for (const [key, value] of Object.entries(obj)) {
        if (typeof value !== 'object' || Array.isArray(value)) {
          writeValue(key, value);
        }
      }

      // Then write subsections
      for (const [key, value] of Object.entries(obj)) {
        if (typeof value === 'object' && !Array.isArray(value)) {
          const newPath = [...path, key];
          result += `\n[${newPath.join('.')}]\n`;
          writeSection(value, newPath);
        }
      }
    };

    writeSection(data);
    return result;
  }

  private _getHtmlForWebview(webview: vscode.Webview, formHtml: string, tomlData: any) {
    // Get path to resource on disk
    const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'main.js'));
    const styleUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'main.css'));

    // Use a nonce to only allow specific scripts to be run
    const nonce = getNonce();

    return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource} 'unsafe-inline'; script-src 'nonce-${nonce}';">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link href="${styleUri}" rel="stylesheet">
        <title>TOML Form Editor</title>
    </head>
    <body>
        <div id="root">
            <div class="form-container">
                <div class="form-header">
                    <h1>${path.basename(this._fileUri.fsPath)} Configuration</h1>
                    <button id="save-btn" class="save-button">💾 Save</button>
                </div>
                <div class="form-content">
                    ${formHtml}
                </div>
            </div>
        </div>
        
        <script nonce="${nonce}">
            const vscode = acquireVsCodeApi();
            window.initialData = ${JSON.stringify(tomlData)};
            
            // Force dark theme detection
            function applyTheme() {
                const body = document.body;
                const isDark = document.body.className.includes('vscode-dark') || 
                              window.matchMedia('(prefers-color-scheme: dark)').matches ||
                              body.getAttribute('data-vscode-theme-kind') === 'vscode-dark' ||
                              body.getAttribute('data-vscode-theme-name')?.includes('dark');
                
                if (isDark) {
                    body.setAttribute('data-theme', 'dark');
                    body.classList.add('vscode-dark');
                    document.documentElement.setAttribute('data-theme', 'dark');
                } else {
                    body.setAttribute('data-theme', 'light');
                    body.classList.add('vscode-light');
                    document.documentElement.setAttribute('data-theme', 'light');
                }
            }
            
            // Apply theme immediately and on changes
            applyTheme();
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', applyTheme);
        </script>
        <script nonce="${nonce}" src="${scriptUri}"></script>
    </body>
    </html>`;
  }

  private _formatTomlError(error: Error): string {
    const message = error.message;
    
    // Extract line/column info if available
    const lineMatch = message.match(/line (\d+)/i);
    const colMatch = message.match(/column (\d+)|position (\d+)/i);
    
    if (lineMatch) {
      const line = lineMatch[1];
      const col = colMatch ? (colMatch[1] || colMatch[2]) : '?';
      return `Line ${line}, Column ${col}: ${message}`;
    }
    
    return message;
  }

  private _getErrorHtml(error: Error, tomlContent?: string) {
    const errorMessage = this._formatTomlError(error);
    const lineNumber = error.message.match(/line (\d+)/i)?.[1];
    
    let codeHighlight = '';
    if (tomlContent && lineNumber) {
      const lines = tomlContent.split('\n');
      const errorLine = parseInt(lineNumber) - 1;
      const start = Math.max(0, errorLine - 2);
      const end = Math.min(lines.length, errorLine + 3);
      
      codeHighlight = lines.slice(start, end).map((line, idx) => {
        const actualLineNum = start + idx + 1;
        const isErrorLine = actualLineNum === parseInt(lineNumber);
        return `<div class="code-line ${isErrorLine ? 'error-line' : ''}" data-line="${actualLineNum}">
          <span class="line-number">${actualLineNum}</span>
          <span class="line-content">${this._escapeHtml(line)}</span>
        </div>`;
      }).join('');
    }
    
    return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>TOML Syntax Error</title>
        <style>
            body { 
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; 
              padding: 20px; 
              background: var(--vscode-editor-background, #1e1e1e);
              color: var(--vscode-editor-foreground, #d4d4d4);
            }
            .error-container { 
              background: var(--vscode-inputValidation-errorBackground, #5a1d1d); 
              border: 1px solid var(--vscode-inputValidation-errorBorder, #be1100);
              border-radius: 6px; 
              padding: 20px;
              margin-bottom: 20px;
            }
            .error-title { 
              color: var(--vscode-inputValidation-errorForeground, #f48771); 
              margin: 0 0 10px 0;
              font-size: 1.2em;
            }
            .error-message { 
              font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
              font-size: 0.9em;
              margin: 0;
              white-space: pre-wrap;
            }
            .code-preview {
              margin-top: 20px;
              background: var(--vscode-editor-background, #1e1e1e);
              border: 1px solid var(--vscode-panel-border, #3c3c3c);
              border-radius: 6px;
              overflow: hidden;
            }
            .code-line {
              display: flex;
              align-items: flex-start;
              min-height: 1.4em;
              font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
              font-size: 0.85em;
            }
            .line-number {
              background: var(--vscode-editorLineNumber-background, #1e1e1e);
              color: var(--vscode-editorLineNumber-foreground, #858585);
              padding: 0 12px;
              min-width: 50px;
              text-align: right;
              user-select: none;
              border-right: 1px solid var(--vscode-panel-border, #3c3c3c);
            }
            .line-content {
              padding: 0 12px;
              flex: 1;
              white-space: pre;
            }
            .error-line {
              background: var(--vscode-inputValidation-errorBackground, rgba(244, 71, 71, 0.15));
            }
            .error-line .line-number {
              background: var(--vscode-inputValidation-errorBackground, #5a1d1d);
              color: var(--vscode-inputValidation-errorForeground, #f48771);
              font-weight: bold;
            }
            .suggestions {
              margin-top: 20px;
              padding: 15px;
              background: var(--vscode-textCodeBlock-background, #0d1117);
              border-radius: 6px;
              border-left: 4px solid var(--vscode-textLink-foreground, #4fb3d9);
            }
            .suggestions h3 {
              margin: 0 0 10px 0;
              color: var(--vscode-textLink-foreground, #4fb3d9);
              font-size: 1em;
            }
            .suggestions ul {
              margin: 0;
              padding-left: 20px;
            }
            .suggestions li {
              margin-bottom: 5px;
            }
        </style>
    </head>
    <body>
        <div class="error-container">
            <h2 class="error-title">⚠️ TOML Syntax Error</h2>
            <pre class="error-message">${errorMessage}</pre>
        </div>
        
        ${codeHighlight ? `
        <div class="code-preview">
            <h3 style="margin: 0; padding: 10px 12px; background: var(--vscode-editor-background); border-bottom: 1px solid var(--vscode-panel-border); font-size: 0.9em;">📄 Code Preview</h3>
            ${codeHighlight}
        </div>
        ` : ''}
        
        <div class="suggestions">
            <h3>💡 Common TOML Issues:</h3>
            <ul>
                <li><strong>Duplicate keys:</strong> Can't redefine the same key</li>
                <li><strong>Invalid characters:</strong> Use quotes for special characters</li>
                <li><strong>Environment variables:</strong> Use plain strings like "your-api-key-here"</li>
                <li><strong>Unmatched quotes:</strong> Ensure all strings are properly quoted</li>
                <li><strong>Invalid escape sequences:</strong> Use \\\\ for backslashes</li>
            </ul>
        </div>
    </body>
    </html>`;
  }

  private _escapeHtml(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
}

function getNonce() {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 32; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}