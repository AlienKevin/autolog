// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as logMessage from "./logMessage";

type LogConfig =
  {
    "wrapper": string,
    "match": string,
    "command": string,
    "comment": string
  }

function init():
  {
    editor: vscode.TextEditor,
    logWrapper: string,
    logRegexp: string,
    commentSymbol: string
  } | undefined
 {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    return undefined;
  }
  var {
    wrapper: logWrapper,
    match: logRegexp,
    comment: commentSymbol } =
  getLogConfig(editor.document.languageId);
  return {
    editor,
    logWrapper,
    logRegexp,
    commentSymbol
  };
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	vscode.commands.registerCommand('extension.addLog', async () => {
      var vars = init();
      if (vars === undefined) {
        return;
      } else {
        var {
          editor,
          logWrapper,
        } = vars;
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
                tabSize,
                logWrapper
              )
            );
          });
        }
			}
  });
  
  vscode.commands.registerCommand(
    "extension.commentAllLogs",
    () => {
      var vars = init();
      if (vars === undefined) {
        return;
      } else {
        var {
          editor,
          logRegexp,
          commentSymbol,
        } = vars;
      }
      const tabSize = editor.options.tabSize;
      const document = editor.document;
      const logMessages = logMessage.detectAll(
        document,
        tabSize,
        logRegexp
      );
      editor.edit(editBuilder => {
        logMessages.forEach(({ lines }) => {
          lines.forEach(({ spaces, range }) => {
            editBuilder.delete(range);
            editBuilder.insert(
              new vscode.Position(range.start.line, 0),
              `${spaces}${commentSymbol} ${document.getText(range).trim()}\n`
            );
          });
        });
      });
    }
  );

  vscode.commands.registerCommand(
    "extension.uncommentAllLogs",
    () => {
      var vars = init();
      if (vars === undefined) {
        return;
      } else {
        var {
          editor,
          logRegexp,
          commentSymbol,
        } = vars;
      }
      const tabSize = editor.options.tabSize;
      const document = editor.document;
      const logMessages = logMessage.detectAll(
        document,
        tabSize,
        logRegexp
      );
      editor.edit(editBuilder => {
        logMessages.forEach(({ lines }) => {
          lines.forEach(({ spaces, range }) => {
            editBuilder.delete(range);
            editBuilder.insert(
              new vscode.Position(range.start.line, 0),
              `${spaces}${document
                .getText(range)
                .replace(new RegExp(commentSymbol, "g"), "")
                .trim()}\n`
            );
          });
        });
      });
    }
  );
}

function getLogConfig(lang: string): LogConfig {
  let configs: any = convertKeysToLowerCase(vscode.workspace.getConfiguration("autolog.configs"));
  return configs[lang.toLowerCase()] || configs['default'];
}

// source: https://stackoverflow.com/a/12540603/6798201
function convertKeysToLowerCase(obj: {[key: string]: any}) {
  var key, keys = Object.keys(obj);
  var n = keys.length;
  var newObj: {[key: string]: any} ={}
  while (n--) {
    key = keys[n];
    newObj[key.toLowerCase()] = obj[key];
  }
  return newObj;
}

// this method is called when your extension is deactivated
export function deactivate() {}
