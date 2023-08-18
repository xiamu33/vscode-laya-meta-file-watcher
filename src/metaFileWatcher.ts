import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';

let watcher: vscode.FileSystemWatcher;
let justCreated: vscode.Uri | null;

export async function activate(folder: vscode.WorkspaceFolder) {
  watcher = vscode.workspace.createFileSystemWatcher(new vscode.RelativePattern(folder, '**/*.{ts,js}'));

  watcher.onDidCreate((uri) => {
    if (uri.fsPath.endsWith('.meta')) return;
    //Ignore file operations done outside of vscode
    if (!vscode.window.state.focused) return;

    if (justCreated) {
      if (uri.fsPath.indexOf(justCreated.fsPath) >= 0) {
        //Change folder name
        return;
      }
    }

    setTimeout(() => (justCreated = null), 200);
    justCreated = uri;
  });

  watcher.onDidDelete((uri) => {
    if (uri.fsPath.endsWith('.meta')) return;
    //Ignore file operations done outside of vscode
    if (!vscode.window.state.focused) return;

    if (justCreated) {
      const justCreatedFsPath = justCreated.fsPath;
      const justDeletedFsPath = uri.fsPath;
      const justCreatedPath = path.parse(justCreatedFsPath);
      const justDeletedPath = path.parse(justDeletedFsPath);

      if (justCreatedPath.dir === justDeletedPath.dir) {
        //change file name
        fs.access(justDeletedFsPath + '.meta', (err) => {
          if (!err) {
            fs.rename(justDeletedFsPath + '.meta', justCreatedFsPath + '.meta', (err) => {
              if (err) throw err;
            });
          }
        });
      } else if (justCreatedPath.base === justDeletedPath.base) {
        //change file location
        fs.access(justDeletedFsPath + '.meta', (err) => {
          if (!err) {
            fs.rename(justDeletedFsPath + '.meta', justCreatedFsPath + '.meta', (err) => {
              if (err) throw err;
            });
          }
        });
      }
    } else {
      //Just normal delete
      fs.access(uri.fsPath + '.meta', (err) => {
        if (!err) {
          fs.unlink(uri.fsPath + '.meta', (err) => {
            if (err) throw err;
          });
        }
      });
    }
  });
}

export async function deactivate() {
  watcher?.dispose();
}
