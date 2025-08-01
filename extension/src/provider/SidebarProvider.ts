import * as vscode from 'vscode';
import { getNonce } from './getNonce';

export class SidebarProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = 'supershiny.sidebar';

  constructor(
    private readonly _extensionUri: vscode.Uri,
  ) { }

  public resolveWebviewView(
    webviewView: vscode.WebviewView,
    context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken,
  ) {
    // Set webview options
    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [
        this._extensionUri
      ]
    };

    // Set the HTML content
    webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

    // Handle webview visibility changes
    webviewView.onDidDispose(() => {
      // Clean up when webview is disposed
      console.log('Webview disposed');
    });

    // Handle messages from the webview
    webviewView.webview.onDidReceiveMessage(async (data) => {
      switch (data.type) {
        case 'loadConfigFiles':
          try {
            const configFiles = await this.loadConfigFiles();
            webviewView.webview.postMessage({ 
              type: 'configFilesLoaded', 
              configFiles 
            });
          } catch (error) {
            console.error('Error loading config files:', error);
            webviewView.webview.postMessage({ 
              type: 'error', 
              message: 'Failed to load config files' 
            });
          }
          break;

        case 'saveConfigFile':
          try {
            await this.saveConfigFile(data.fileName, data.content);
            webviewView.webview.postMessage({ 
              type: 'configFileSaved', 
              fileName: data.fileName 
            });
          } catch (error) {
            console.error('Error saving config file:', error);
            webviewView.webview.postMessage({ 
              type: 'error', 
              message: 'Failed to save config file' 
            });
          }
          break;
        case 'webviewDisposed':
          console.log('Webview disposed by user');
          break;
      }
    });
  }

  private async loadConfigFiles(): Promise<{ name: string; content: string }[]> {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) {
      return [];
    }

    const configFiles: { name: string; content: string }[] = [];

    for (const folder of workspaceFolders) {
      // Search for .config and .shiny files
      const configPattern = new vscode.RelativePattern(folder, '**/*.{config,shiny}');
      const files = await vscode.workspace.findFiles(configPattern);

      for (const file of files) {
        try {
          const content = await vscode.workspace.fs.readFile(file);
          const fileName = file.path.split('/').pop() || '';
          configFiles.push({
            name: fileName,
            content: Buffer.from(content).toString('utf8')
          });
        } catch (error) {
          console.error(`Error reading file ${file.path}:`, error);
        }
      }
    }

    return configFiles;
  }

  private async saveConfigFile(fileName: string, content: string): Promise<void> {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) {
      throw new Error('No workspace folders found');
    }

    // Find the file in the workspace
    const configPattern = new vscode.RelativePattern(workspaceFolders[0], `**/${fileName}`);
    const files = await vscode.workspace.findFiles(configPattern);

    if (files.length === 0) {
      throw new Error(`File ${fileName} not found`);
    }

    const fileUri = files[0];
    await vscode.workspace.fs.writeFile(fileUri, Buffer.from(content, 'utf8'));
  }

  private _getHtmlForWebview(webview: vscode.Webview) {
    const scriptUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "out", "main.js")
    );
    const mainCssUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "out", "main.css")
    );

    // Use a nonce to only allow specific scripts to be run
    const nonce = getNonce();

    return `<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">
				<!--
					Use a content security policy to only allow loading images from https or from our extension directory,
					and only allow scripts that have a specific nonce.
				-->
				<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource}; script-src 'nonce-${nonce}';">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<link rel="stylesheet" href="${mainCssUri}">
				<title>SuperShiny Config Editor</title>
			</head>
			<body>
				<div id="root"></div>
				<script nonce="${nonce}" src="${scriptUri}"></script>
				<script nonce="${nonce}">
					// Handle webview lifecycle
					window.addEventListener('beforeunload', () => {
						// Clean up before unload
						if (window.vscode) {
							window.vscode.postMessage({ type: 'webviewDisposed' });
						}
					});
				</script>
			</body>
			</html>`;
  }
}
