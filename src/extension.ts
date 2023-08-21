// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as fs from 'fs';
import * as vscode from 'vscode';
import * as metaFileWatcher from './metaFileWatcher';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  console.info('Congratulations, your extension "laya-meta-files-watcher" is now active!');
  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (!workspaceFolders?.length) return;

  const folders: vscode.WorkspaceFolder[] = [];
  workspaceFolders.forEach((folder) => {
    const files = fs.readdirSync(folder.uri.fsPath);
    const isLayaProj = !!files.filter((file) => file.endsWith('.laya')).length;
    if (!isLayaProj) return;
    metaFileWatcher.activate(folder);
    folders.push(folder);
  });

  const disposable = vscode.commands.registerCommand('CleanUpUselessMetaFiles', () => {
    if (folders.length) {
      metaFileWatcher.cleanUpMetaFiles(folders);
    } else {
      vscode.window.showInformationMessage('There is no laya project in workspace!');
    }
  });
  context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {
  metaFileWatcher.deactivate();
}
