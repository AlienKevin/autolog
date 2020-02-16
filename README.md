# Auto Log

![Auto Log Logo](./media/logo.png)

Automated logging for any language in VS Code.

# Features

By pressing <kbd>shift</kbd>+<kbd>alt</kbd>+<kbd>l</kbd>, you can **insert** a log message for different languages, formatted and indented.

By pressing <kbd>shift</kbd>+<kbd>alt</kbd>+<kbd>c</kbd>, you can **comment** out all log messages created by Auto Log.

By pressing <kbd>shift</kbd>+<kbd>alt</kbd>+<kbd>u</kbd>, you can **uncomment** out all log messages created by Auto Log.

# Extension Settings

- `autolog.languages`: list of log settings for each language
  - `$eSEL`: escaped selection (`"`, `'`, `` ` `` are escaped)
  - `$SEL`: non-escaped selection

  Format:
  ```json
  {
    "<language_name>": {
      "wrapper": "<(Required) format of log messages>",
      "match": "<(Required) regular expression matching a log message, used for commenting and uncommenting>. Reference the default regexps below on how to write one.",
      "comment": "<(Required) single line comment symbol.>",
      "prefix": "<(Optional) log prefix for this language.>"
    }
  }
  ```

  Default value:
  ```json
  {
    "javascript": {
      "wrapper": "console.log('$eSEL', $SEL)",
      "match": "^(.*\\b)?console\\.log\\(([^)]*)\\);?.*$",
      "comment": "//"
    },
    "typescript": {
      "wrapper": "console.log('$eSEL', $SEL)",
      "match": "^(.*\\b)?console\\.log\\(([^)]*)\\);?.*$",
      "comment": "//"
    },
    "elm": {
      "wrapper": "_ = Debug.log \"$eSEL\" <| $SEL",
      "match": "^.*=\\s*(\n\\s*)?(\\-*\\s*)*Debug\\.log.*$",
      "comment": "--",
      "prefix": "AL -> "
    },
    "python": {
      "wrapper": "print('$eSEL', $SEL)",
      "match": "^(.*\\b)?print\\(([^)]*)\\).*$",
      "comment": "#"
    },
    "default": {
      "wrapper": "print($SEL);",
      "match": "^(.*\\b)?print\\(([^)]*)\\).*$",
      "comment": "//"
    }
  }
  ```
  Default will be used if Auto Log doesn't find the log settings for the selected language. Follow the format to specify log settings for the languages you want that are not listed in the default value above. PRs are welcome for adding more default language log settings.

- `autolog.prefix`: Prefix used for all languages' logs, except those with `prefix` property defined in the `autolog.languages`.

  Format: string

  Default value: `"AL: "`

  Set `autolog.prefix` to `""` (empty string) to produce unprefixed log messages. Note that Auto Log will now comment and uncomment all log messages in the file, regardless whether they are created using Auto Log.

# License
MIT

# Credit
- [Turbo Console Log](https://github.com/Chakroun-Anas/turbo-console-log)
- [Log Wrapper](https://github.com/chrisvltn/vs-code-log-wrapper)
