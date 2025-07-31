import * as vscode from 'vscode';
import * as toml from 'toml';

export class TomlDiagnosticProvider {
  private diagnosticCollection: vscode.DiagnosticCollection;
  private disposables: vscode.Disposable[] = [];

  constructor() {
    this.diagnosticCollection = vscode.languages.createDiagnosticCollection('toml');
    
    // Listen for document changes
    this.disposables.push(
      vscode.workspace.onDidOpenTextDocument(this.validateDocument, this),
      vscode.workspace.onDidChangeTextDocument(this.onDocumentChanged, this),
      vscode.workspace.onDidCloseTextDocument(this.onDocumentClosed, this)
    );

    // Validate all currently open TOML documents
    vscode.workspace.textDocuments.forEach(this.validateDocument, this);
  }

  private onDocumentChanged(event: vscode.TextDocumentChangeEvent): void {
    if (this.isTomlDocument(event.document)) {
      // Debounce validation to avoid excessive parsing
      this.debounceValidation(event.document);
    }
  }

  private onDocumentClosed(document: vscode.TextDocument): void {
    if (this.isTomlDocument(document)) {
      this.diagnosticCollection.delete(document.uri);
    }
  }

  private debounceTimeouts = new Map<string, NodeJS.Timeout>();

  private debounceValidation(document: vscode.TextDocument): void {
    const key = document.uri.toString();
    
    // Clear existing timeout
    const existingTimeout = this.debounceTimeouts.get(key);
    if (existingTimeout) {
      clearTimeout(existingTimeout);
    }

    // Set new timeout for validation
    const timeout = setTimeout(() => {
      this.validateDocument(document);
      this.debounceTimeouts.delete(key);
    }, 500); // 500ms debounce

    this.debounceTimeouts.set(key, timeout);
  }

  private validateDocument(document: vscode.TextDocument): void {
    if (!this.isTomlDocument(document)) {
      return;
    }

    const diagnostics: vscode.Diagnostic[] = [];
    const text = document.getText();

    try {
      // Try to parse the TOML content
      toml.parse(text);
      
      // If parsing succeeds, clear any existing diagnostics
      this.diagnosticCollection.set(document.uri, []);
      
    } catch (error: any) {
      // Create diagnostic for the error
      const diagnostic = this.createDiagnosticFromError(error, document, text);
      if (diagnostic) {
        diagnostics.push(diagnostic);
      }
    }

    // Additional custom validations
    this.addCustomValidations(document, text, diagnostics);

    // Set diagnostics for this document
    this.diagnosticCollection.set(document.uri, diagnostics);
  }

  private createDiagnosticFromError(error: any, document: vscode.TextDocument, text: string): vscode.Diagnostic | null {
    const message = error.message || 'Unknown TOML parsing error';
    let line = 0;
    let character = 0;

    // Try to extract line and column information from the error
    const lineMatch = message.match(/line (\d+)/i);
    const colMatch = message.match(/column (\d+)|position (\d+)/i);

    if (lineMatch) {
      line = Math.max(0, parseInt(lineMatch[1]) - 1); // Convert to 0-based
    }

    if (colMatch) {
      character = Math.max(0, parseInt(colMatch[1] || colMatch[2]) - 1); // Convert to 0-based
    }

    // Ensure line is within document bounds
    if (line >= document.lineCount) {
      line = document.lineCount - 1;
    }

    const lineText = document.lineAt(line).text;
    
    // If no column info, try to find the problematic part of the line
    if (character === 0 && lineText.length > 0) {
      // Look for common error patterns
      if (message.includes('duplicate') && message.includes('key')) {
        const keyMatch = lineText.match(/^\\s*([A-Za-z0-9_-]+)\\s*=/);
        if (keyMatch) {
          character = lineText.indexOf(keyMatch[1]);
        }
      } else if (message.includes('Expected')) {
        // Find the first non-whitespace character
        character = lineText.search(/\\S/);
        if (character === -1) character = 0;
      }
    }

    // Ensure character is within line bounds
    if (character >= lineText.length) {
      character = Math.max(0, lineText.length - 1);
    }

    // Create range for the diagnostic
    const startPos = new vscode.Position(line, character);
    const endPos = new vscode.Position(line, Math.min(character + 10, lineText.length)); // Highlight ~10 chars
    const range = new vscode.Range(startPos, endPos);

    // Create the diagnostic
    const diagnostic = new vscode.Diagnostic(
      range,
      `TOML Error: ${this.formatErrorMessage(message)}`,
      vscode.DiagnosticSeverity.Error
    );

    diagnostic.source = 'TOML Parser';
    diagnostic.code = 'toml-syntax-error';

    return diagnostic;
  }

  private addCustomValidations(document: vscode.TextDocument, text: string, diagnostics: vscode.Diagnostic[]): void {
    const lines = text.split('\\n');

    lines.forEach((line, lineIndex) => {
      // Check for environment variable syntax that might cause issues
      if (line.includes('{env:') || line.includes('${')) {
        const match = line.match(/(\\{env:[^}]+\\}|\\$\\{[^}]+\\})/);
        if (match) {
          const startChar = line.indexOf(match[0]);
          const endChar = startChar + match[0].length;
          
          const range = new vscode.Range(
            new vscode.Position(lineIndex, startChar),
            new vscode.Position(lineIndex, endChar)
          );

          const diagnostic = new vscode.Diagnostic(
            range,
            'Environment variable syntax may not be supported by all TOML parsers. Consider using plain strings.',
            vscode.DiagnosticSeverity.Warning
          );

          diagnostic.source = 'TOML Linter';
          diagnostic.code = 'env-var-syntax';
          diagnostics.push(diagnostic);
        }
      }

      // Check for potential duplicate keys (simple check)
      const keyMatch = line.match(/^\\s*([A-Za-z0-9_.-]+)\\s*=/);
      if (keyMatch) {
        const key = keyMatch[1];
        const keyPattern = new RegExp(`^\\\\s*${key.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&')}\\\\s*=`, 'gm');
        const matches = text.match(keyPattern);
        
        if (matches && matches.length > 1) {
          const startChar = line.indexOf(key);
          const endChar = startChar + key.length;
          
          const range = new vscode.Range(
            new vscode.Position(lineIndex, startChar),
            new vscode.Position(lineIndex, endChar)
          );

          const diagnostic = new vscode.Diagnostic(
            range,
            `Potential duplicate key '${key}'. TOML keys must be unique.`,
            vscode.DiagnosticSeverity.Warning
          );

          diagnostic.source = 'TOML Linter';
          diagnostic.code = 'duplicate-key';
          diagnostics.push(diagnostic);
        }
      }
    });
  }

  private formatErrorMessage(message: string): string {
    // Clean up common error messages
    return message
      .replace(/^Error: /, '')
      .replace(/at line \\d+, column \\d+:?\\s*/, '')
      .trim();
  }

  private isTomlDocument(document: vscode.TextDocument): boolean {
    return document.languageId === 'toml' || 
           document.fileName.endsWith('.toml') || 
           document.fileName.endsWith('.config');
  }

  dispose(): void {
    this.diagnosticCollection.dispose();
    this.disposables.forEach(d => d.dispose());
    
    // Clear all debounce timeouts
    this.debounceTimeouts.forEach(timeout => clearTimeout(timeout));
    this.debounceTimeouts.clear();
  }
}