import * as vscode from 'vscode';
import { TomlFormPanel } from './TomlFormPanel';
import { TomlDiagnosticProvider } from './TomlDiagnostics';

export function activate(context: vscode.ExtensionContext) {
  console.log('TOML → shadcn/ui Forms extension is now active!');

  // Initialize TOML diagnostic provider for inline linting
  const diagnosticProvider = new TomlDiagnosticProvider();
  context.subscriptions.push(diagnosticProvider);

  // Register command to open TOML form editor
  const openEditorCommand = vscode.commands.registerCommand('tomlForms.openEditor', (uri?: vscode.Uri) => {
    const fileUri = uri || vscode.window.activeTextEditor?.document.uri;
    
    if (!fileUri) {
      vscode.window.showErrorMessage('No file selected. Please open a .config or .toml file.');
      return;
    }

    // Check if it's a TOML/config file
    const fileName = fileUri.fsPath;
    if (!fileName.endsWith('.config') && !fileName.endsWith('.toml')) {
      vscode.window.showErrorMessage('This command only works with .config or .toml files.');
      return;
    }

    TomlFormPanel.createOrShow(context.extensionUri, fileUri);
  });

  // Register command to refresh the form editor
  const refreshEditorCommand = vscode.commands.registerCommand('tomlForms.refreshEditor', () => {
    TomlFormPanel.refresh();
  });

  // Register command to reload the extension (development helper)
  const reloadExtensionCommand = vscode.commands.registerCommand('tomlForms.reloadExtension', () => {
    vscode.commands.executeCommand('workbench.action.reloadWindow');
  });

  // Auto-open form editor for .config files if setting is enabled
  const onDidOpenTextDocument = vscode.workspace.onDidOpenTextDocument((document) => {
    const config = vscode.workspace.getConfiguration('tomlForms');
    if (!config.get('autoOpen', true)) return;

    const fileName = document.fileName;
    if (fileName.endsWith('.config') || fileName.endsWith('.toml')) {
      // Small delay to let the text editor fully load
      setTimeout(() => {
        TomlFormPanel.createOrShow(context.extensionUri, document.uri);
      }, 500);
    }
  });

  context.subscriptions.push(
    openEditorCommand,
    refreshEditorCommand,
    reloadExtensionCommand,
    onDidOpenTextDocument
  );
}

export function deactivate() {
  TomlFormPanel.dispose();
}