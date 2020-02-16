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
  const spacesBeforeMsg = spacesBeforeLog(document, lineOfSelectedVar, tabSize);
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
function spacesBeforeLog(document: vscode.TextDocument, line: number, tabSize: number): string {
  const currentLine = document.lineAt(line);
  if (line < document.lineCount - 1) { // before last line
    const nextLine = document.lineAt(line + 1);
    const nextLineTextChars = nextLine.text.split("");
    // next line not empty
    if (nextLineTextChars.filter((char: string) => char !== " ").length !== 0) {
      if (
        nextLine.firstNonWhitespaceCharacterIndex >
        currentLine.firstNonWhitespaceCharacterIndex
      ) {
        return spacesBeforeLine(document, line + 1, tabSize)
      } else {
        return spacesBeforeLine(document, line, tabSize);
      }
    } else { // next line is empty
      return spacesBeforeLine(document, line, tabSize);
    }
  } else { // last line
    return spacesBeforeLine(document, line, tabSize);
  }
}

function spacesBeforeLine(document: vscode.TextDocument, line: number, tabSize: number): string {
  const currentLine = document.lineAt(line);
  const currentLineTextChars = currentLine.text.split("");
  if (
    currentLineTextChars[currentLine.firstNonWhitespaceCharacterIndex - 1] ===
    "\t"
  ) {
    return " ".repeat(
      currentLine.firstNonWhitespaceCharacterIndex * tabSize
    );
  } else {
    return " ".repeat(currentLine.firstNonWhitespaceCharacterIndex);
  }
}

type LogLocation =
({ lines: { spaces: string, range: vscode.Range }[]})

function detectAll(document: vscode.TextDocument, tabSize: any): LogLocation[]
 {
  const documentNbrOfLines = document.lineCount;
  const logMessages: ({ lines: { spaces: string, range: vscode.Range }[]})[] = [];
  const logMessageRegexp = new RegExp(`^.*=\\s*(\n\\s*)?\-*\\s*Debug.log.*`);
  for (let i = 0; i < documentNbrOfLines; i++) {
    const currLine = document.lineAt(i).text;
    const nextLine = (
      i >= documentNbrOfLines - 1
        ? ""
        : document.lineAt(i + 1).text
    );
    const logMessageLines: LogLocation = { lines: [] };
    if (logMessageRegexp.test(currLine)) {
      logMessageLines.lines.push({
        spaces: spacesBeforeLine(document, i, tabSize),
        range: document.lineAt(i).rangeIncludingLineBreak
      });
      logMessages.push(logMessageLines);
    } else if (logMessageRegexp.test(currLine + "\n" + nextLine)) {
      logMessageLines.lines.push({
        spaces: spacesBeforeLine(document, i, tabSize),
        range: document.lineAt(i).rangeIncludingLineBreak
      });
      logMessageLines.lines.push({
        spaces: spacesBeforeLine(document, i + 1, tabSize),
        range: document.lineAt(i + 1).rangeIncludingLineBreak
      });
      logMessages.push(logMessageLines);
      i++;
    }
  }
  return logMessages;
}

export {
  message,
  logMessageLine,
  spacesBeforeLog as spaces,
  detectAll
}
// module.exports.detectAll = detectAll;