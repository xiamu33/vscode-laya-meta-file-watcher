import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';

let watcher: vscode.FileSystemWatcher;
let justCreated: vscode.Uri | null;

export function activate(folder: vscode.WorkspaceFolder) {
  watcher = vscode.workspace.createFileSystemWatcher(new vscode.RelativePattern(folder, '**/*'));

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
        fs.access(`${justDeletedFsPath}.meta`, (err) => {
          if (!err) {
            fs.rename(`${justDeletedFsPath}.meta`, `${justCreatedFsPath}.meta`, (err) => {
              if (err) {
                console.error(err);
                throw err;
              }
            });
          }
        });
      } else if (justCreatedPath.base === justDeletedPath.base) {
        //change file location
        fs.access(`${justDeletedFsPath}.meta`, (err) => {
          if (!err) {
            fs.rename(`${justDeletedFsPath}.meta`, `${justCreatedFsPath}.meta`, (err) => {
              if (err) {
                console.error(err);
                throw err;
              }
            });
          }
        });
      }
    } else {
      //Just normal delete
      fs.access(`${uri.fsPath}.meta`, (err) => {
        if (!err) {
          fs.unlink(`${uri.fsPath}.meta`, (err) => {
            if (err) {
              console.error(err);
              throw err;
            }
          });
        }
      });
    }
  });
}

export function cleanUpMetaFiles(folders: vscode.WorkspaceFolder[]) {
  folders.forEach((folder) => {
    const metaFilePaths = findAllMetaFiles(folder.uri.fsPath);
    metaFilePaths.forEach((metaPath) => {
      const reg = /(?<path>.*).meta/;
      const execRst = reg.exec(metaPath);
      const filePath = execRst?.groups?.path;
      if (!filePath || !fs.existsSync(filePath)) {
        fs.unlink(metaPath, (err) => {
          if (err) {
            console.error(err);
            throw err;
          }
        });
      }
    });
  });
}

function findAllMetaFiles(basePath: string) {
  const filePaths: string[] = [];
  const files = fs.readdirSync(basePath);
  files.forEach((file) => {
    const filePath = path.join(basePath, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      filePaths.push(...findAllMetaFiles(filePath));
    } else if (filePath.endsWith('.meta')) {
      filePaths.push(filePath);
    }
  });
  return filePaths;
}

export function deactivate() {
  watcher?.dispose();
}
