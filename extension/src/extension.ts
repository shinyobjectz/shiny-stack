import * as vscode from "vscode";
import { SidebarProvider } from "./provider/SidebarProvider";

let sidebarProvider: SidebarProvider | undefined;

export function activate(context: vscode.ExtensionContext) {
  // Only create and register the provider if it doesn't already exist
  if (!sidebarProvider) {
    sidebarProvider = new SidebarProvider(context.extensionUri);
    context.subscriptions.push(
      vscode.window.registerWebviewViewProvider(
        "supershiny.sidebar", // Match the ID in package.json
        sidebarProvider
      )
    );
  }
}

export function deactivate() {
  // Clean up the provider
  sidebarProvider = undefined;
}
