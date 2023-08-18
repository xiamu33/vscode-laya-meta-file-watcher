// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as fs from 'fs';
import * as vscode from 'vscode';
import * as metaFileWatcher from './metaFileWatcher';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate() {
  console.info('Congratulations, your extension "laya-meta-files-watcher" is now active!');
  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (!workspaceFolders?.length) return;
  workspaceFolders.forEach((folder) => {
    const files = fs.readdirSync(folder.uri.fsPath);
    const isLayaProj = !!files.filter((file) => file.endsWith('.laya')).length;
    if (!isLayaProj) return;
    metaFileWatcher.activate(folder);
  });
}

// This method is called when your extension is deactivated
export function deactivate() {
  metaFileWatcher.deactivate();
}
