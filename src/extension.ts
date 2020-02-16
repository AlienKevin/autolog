// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as logMessage from "./logMessage";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	vscode.commands.registerCommand('extension.addElmLog', async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        return;
      }
      const tabSize = editor.options.tabSize;
      const document = editor.document;
      for (let index = 0; index < editor.selections.length; index++) {
        const selection = editor.selections[index];
        const selectedVar = document.getText(selection);
        const lineOfSelectedVar = selection.active.line;
        // Check if the selection line is not the last one in the document and the selected variable is not empty
        if (selectedVar.trim().length !== 0) {
          await editor.edit(editBuilder => {
            const logMessageLine = logMessage.logMessageLine(
              document,
              lineOfSelectedVar,
            );
            editBuilder.insert(
              new vscode.Position(
                logMessageLine >= document.lineCount
                  ? document.lineCount
                  : logMessageLine,
                0
              ),
              logMessage.message(
                document,
                selectedVar,
                lineOfSelectedVar,
                tabSize
              )
            );
          });
        }
			}
  });
  
  vscode.commands.registerCommand(
    "extension.commentAllElmLogs",
    () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        return;
      }
      const tabSize = editor.options.tabSize;
      const document = editor.document;
      const logMessages = logMessage.detectAll(
        document,
        tabSize
      );
      editor.edit(editBuilder => {
        logMessages.forEach(({ lines }) => {
          lines.forEach(({ spaces, range }) => {
            editBuilder.delete(range);
            editBuilder.insert(
              new vscode.Position(range.start.line, 0),
              `${spaces}-- ${document.getText(range).trim()}\n`
            );
          });
        });
      });
    }
  );

  vscode.commands.registerCommand(
    "extension.uncommentAllElmLogs",
    () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        return;
      }
      const tabSize = editor.options.tabSize;
      const document = editor.document;
      const logMessages = logMessage.detectAll(
        document,
        tabSize
      );
      editor.edit(editBuilder => {
        logMessages.forEach(({ lines }) => {
          lines.forEach(({ spaces, range }) => {
            editBuilder.delete(range);
            editBuilder.insert(
              new vscode.Position(range.start.line, 0),
              `${spaces}${document
                .getText(range)
                .replace(/\-\-/g, "")
                .trim()}\n`
            );
          });
        });
      });
    }
  );
}

// this method is called when your extension is deactivated
export function deactivate() {}
