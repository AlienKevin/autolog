import * as vscode from "vscode";

/**
 * Return a log message on the following format: ClassThatEncloseTheSelectedVar -> FunctionThatEncloseTheSelectedVar -> TheSelectedVar, SelectedVarValue
 * @function
 * @param {TextDocument} document
 * @see {@link https://code.visualstudio.com/docs/extensionAPI/vscode-api#TextDocument}
 * @param {string} selectedVar
 * @param {number} lineOfSelectedVar
 * @param {boolean} wrapLogMessage
 * @param {string} logMessagePrefix
 * @param {string} quote
 * @param {boolean} addSemicolonInTheEnd
 * @param {number} tabSize
 * @return {string}
 * @author Chakroun Anas <chakroun.anas@outlook.com>
 * @since 1.0
 */
function message(
  document: vscode.TextDocument,
  selectedVar: any,
  lineOfSelectedVar: any,
  tabSize: any
) {
  const lineOfLogMsg = logMessageLine(document, lineOfSelectedVar);
  const spacesBeforeMsg = spaces(document, lineOfSelectedVar, tabSize);
  const debuggingMsg = `_ = Debug.log "${selectedVar}" ${selectedVar}`;
  return `${
    lineOfLogMsg === document.lineCount ? "\n" : ""
  }${spacesBeforeMsg}${debuggingMsg}\n`;
}

function logMessageLine(document: vscode.TextDocument, selectionLine: number) {
  if (selectionLine === document.lineCount - 1) {
    return selectionLine;
  }
  return selectionLine + 1;
}

/**
 * Line Spaces
 * @function
 * @param {TextDocument} document
 * @see {@link https://code.visualstudio.com/docs/extensionAPI/vscode-api#TextDocument}
 * @param {number} line
 * @param {number} tabSize
 * @return {string} Spaces
 * @author Chakroun Anas <chakroun.anas@outlook.com>
 * @since 1.0
 */
function spaces(document: vscode.TextDocument, line: number, tabSize: number): string {
  const currentLine = document.lineAt(line);
  const currentLineTextChars = currentLine.text.split("");
    const nextLine = document.lineAt(line + 1);
    const nextLineTextChars = nextLine.text.split("");
    if (nextLineTextChars.filter((char: string) => char !== " ").length !== 0) {
      if (
        nextLine.firstNonWhitespaceCharacterIndex >
        currentLine.firstNonWhitespaceCharacterIndex
      ) {
        if (
          nextLineTextChars[nextLine.firstNonWhitespaceCharacterIndex - 1] ===
          "\t"
        ) {
          return " ".repeat(
            nextLine.firstNonWhitespaceCharacterIndex * tabSize
          );
        } else {
          return " ".repeat(nextLine.firstNonWhitespaceCharacterIndex);
        }
      } else {
        if (
          currentLineTextChars[
            currentLine.firstNonWhitespaceCharacterIndex - 1
          ] === "\t"
        ) {
          return " ".repeat(
            currentLine.firstNonWhitespaceCharacterIndex * tabSize
          );
        } else {
          return " ".repeat(currentLine.firstNonWhitespaceCharacterIndex);
        }
      }
    } else {
      if (
        currentLineTextChars[
          currentLine.firstNonWhitespaceCharacterIndex - 1
        ] === "\t"
      ) {
        return " ".repeat(
          currentLine.firstNonWhitespaceCharacterIndex * tabSize
        );
      } else {
        return " ".repeat(currentLine.firstNonWhitespaceCharacterIndex);
      }
    }
  }

export {
  message,
  logMessageLine,
  spaces
}
// module.exports.detectAll = detectAll;