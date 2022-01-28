const util = require("util");

export function Paragraph(_input: string[], _spacing = true) {
  _input.forEach((value) => stdout(value));
  if (_spacing) {
    stdout();
  }
}

export function List(_input: string[]) {
  _input.forEach((value) => stdout(`* ${value}`));
}

export function Divider(_width = 1) {
  for (let i = 0; i < _width; i++) {
    stdout("=".repeat(90));
  }
}

/**
 *
 * @param {string} _input
 * @constructor
 */
export function Line(_input: string | number | boolean): void {
  stdout(_input);
}

export function Empty(): void {
  stdout();
}

export function Error(_input): void {
  stdout(_input, { foreground_colour: FG_COLOURS.FgRed });
}

export enum QuestionTypes {
  Input_String,
  Input_Number,
  Select_Boolean,
  Select_Single,
  Select_Multiple,
}

interface QuestionOptions {
  prompt: string;
  prompt_type: QuestionTypes;
  prompt_options?: {};
  default_value?: any;
  allow_multiline?: boolean;
}

class Answer {
  type: QuestionTypes;
  responses: {
    selection_id?: number;
    value: string | number | boolean;
  }[];

  getValue() {
    if (this.responses.length >= 1) {
      return this.responses[0];
    } else {
      return {};
    }
  }

  getValues() {
    let _v = [];
    this.responses.forEach((value, index) => _v.push(value));
    return _v;
  }

  addResponse(_value, _section_id = 0) {
    this.responses.push({ selection_id: _section_id, value: _value });
  }
}

export function Question(opts: QuestionOptions): Answer {
  const prompt = require("prompt-sync")({ sigint: true });
  const t = require("./txt_utils");
  let a = new Answer();
  switch (opts.prompt_type) {
    case QuestionTypes.Select_Boolean:
      let response = prompt(opts.prompt, opts.default_value).toLowerCase();
      if (response === ":q" || response === ":quit") {
        a.addResponse("");
      } else if (response === "") {
        if (t.parse_string_to_boolean(opts.default_value) !== null) {
          a.addResponse(t.parse_string_to_boolean(opts.default_value));
        } else {
          a.addResponse("");
        }
      } else if (t.parse_string_to_boolean(response) === null) {
        Line("Unknown input passed. Please try again");
        a.addResponse(
          Question({
            prompt: "",
            prompt_type: opts.prompt_type,
            default_value: opts.default_value,
          }).getValue()
        );
      } else {
        a.addResponse(t.parse_string_to_boolean(response));
      }
      break;
    case QuestionTypes.Select_Single:
      break;
    case QuestionTypes.Select_Multiple:
      break;
    case QuestionTypes.Input_String:
    case QuestionTypes.Input_Number:
      if (opts.allow_multiline) {
        let response = prompt(opts.prompt, opts.default_value);
        a.addResponse(response);

        while (response !== ":q") {
          response = prompt("(cont.)>", opts.default_value);
          a.addResponse(response);
        }
      } else {
        let response = prompt(opts.prompt, opts.default_value);
        a.addResponse(response);
      }
  }
  return a;
}

export function Object(_object: {}, _name?: string): void {
  let _o = "";
  if (_name) {
    _o = `${_name} = `;
  }
  _o += util.inspect(_object);
  stdout(_o);
}

export function Run(_command, _directory = process.cwd()) {
  const child_process = require("child_process");
  child_process.exec(_command, { cwd: _directory }, (error, stdout, stderr) => {
    if (error) {
      Error(
        `Error occurred while executing command: \`${_command}\` in directory: ${_directory}`
      );
    } else if (stdout) {
      Line(stdout);
    }
  });
}

enum STDOUT_MODIFIERS {
  Reset = "\x1b[0m",
  Bright = "\x1b[1m",
  Dim = "\x1b[2m",
  Underscore = "\x1b[4m",
  Blink = "\x1b[5m",
  Reverse = "\x1b[7m",
  Hidden = "\x1b[8m",
}

enum FG_COLOURS {
  FgBlack = "\x1b[30m",
  FgRed = "\x1b[31m",
  FgGreen = "\x1b[32m",
  FgYellow = "\x1b[33m",
  FgBlue = "\x1b[34m",
  FgMagenta = "\x1b[35m",
  FgCyan = "\x1b[36m",
  FgWhite = "\x1b[37m",
}

enum BG_COLOURS {
  BgBlack = "\x1b[40m",
  BgRed = "\x1b[41m",
  BgGreen = "\x1b[42m",
  BgYellow = "\x1b[43m",
  BgBlue = "\x1b[44m",
  BgMagenta = "\x1b[45m",
  BgCyan = "\x1b[46m",
  BgWhite = "\x1b[47m",
}

export function Colour(
  _text,
  _styles:
    | [FG_COLOURS | BG_COLOURS | STDOUT_MODIFIERS]
    | FG_COLOURS
    | BG_COLOURS
    | STDOUT_MODIFIERS
) {
  return _styles + _text + STDOUT_MODIFIERS.Reset;
}

Line(Colour("Hello World!", FG_COLOURS.FgGreen));

enum STDOUT_TYPES {
  log,
  error,
}

interface STDOUT_STYLE {
  modifier?: STDOUT_MODIFIERS;
  foreground_colour?: FG_COLOURS;
  background_colour?: BG_COLOURS;
}

function stdout(
  _line: string | number | boolean = "",
  _style: STDOUT_STYLE = { modifier: STDOUT_MODIFIERS.Reset }
): void {
  console.log(_style, _line);
}
