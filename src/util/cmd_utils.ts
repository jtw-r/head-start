import * as util from "util";
import { Answer } from "./classes/Answer";
import { STDOUT_STYLE } from "./interfaces/STDOUT_STYLE";
import { Question_Types } from "./enums/Question_Types";
import { BG_COLOURS, FG_COLOURS, STDOUT_MODIFIERS } from "./enums/STDOUT";
import { Question_Options } from "./interfaces/Question_Options";
import { cb__handle_run_default, handle_questions } from "./callbacks";
import * as child_process from "child_process";
import prompts = require("prompts");

/**
 * Prints out a paragraph of texts to the console.
 * @param {string[]} _input The array of strings to print.
 * @param {boolean} _spacing T/F: Add a blank new line after the paragraph. Default is true which adds the empty line.
 * @constructor
 * @returns {void}
 */
export function Paragraph(_input: string[], _spacing: boolean = true): void {
  _input.forEach((value) => stdout(value));
  if (_spacing) {
    Empty();
  }
}

/**
 * Prints out each element in an array in a list form.
 * @param {any[]} _list The array to print out
 * @param {string} _line_prefix The character to prefix each new line in the list with. Adds a space at the end. Default
 * is "*"
 * @constructor
 * @returns {void}
 */
export function List(_list: any[], _line_prefix: string = "*"): void {
  _list.forEach((value) => stdout(`* ${value}`));
}

/**
 * Prints out a line of repeating text to divide the console.
 * @param {number} rows The number of rows the divider should be. Default is 1
 * @param {number} length The length/width of each row. Default is 90 character
 * @param {string} pattern The character/string to repeat. Default is "="
 * @constructor
 * @returns {void}
 */
export function Divider(rows: number = 1, length: number = 90, pattern: string = "="): void {
  for (let i = 0; i < rows; i++) {
    stdout(pattern.repeat(Math.round(length / pattern.length)));
  }
}

/**
 * Prints a line of text to the console.
 * @param {string | number | boolean} _output The message that will be printed out to the console
 * @constructor
 * @returns {void}
 */
export function Line(_output: string | number | boolean): void {
  stdout(_output);
}

/**
 * Prints an empty line to the console.
 * @constructor
 * @returns {void}
 */
export function Empty(): void {
  stdout();
}

/**
 * Outputs an error, and aborts the process.
 * @param {string | number | boolean} _error_message The message that will be printed out to the console
 * @constructor
 * @returns {never}
 */
export function Error(_error_message: string | number | boolean): never {
  stdout(_error_message, { foreground_colour: FG_COLOURS.FgRed });
  process.exit(1);
}

/**
 * Aborts the process.
 * @param {string} _abort_message The message that will be printed to the console before aborting. Default is "Aborting"
 * @param {number} _code The process exit code. Default is 0
 * @constructor
 * @returns {never}
 */
export function Abort(_abort_message = "Aborting", _code = 0): never {
  Line(_abort_message);
  process.exit(_code);
}

/**
 * Prints out a question to the console. Waits for user input and returns a promise with the answer containing the
 * responses.
 * @param {Question_Options} _options
 * @constructor
 * @returns {Promise<Answer>}
 */
export async function Question(_options: Question_Options): Promise<Answer> {
  switch (_options.prompt_type) {
    case Question_Types.Input_Boolean:
      let t = require("./txt_utils");
      return await handle_questions(
        prompts({
          type: "confirm",
          name: "value",
          message: _options.prompt,
          initial: t.parse_string_to_boolean(_options.default_value),
        })
      );
    case Question_Types.Toggle:
      let active_value = "true";
      let inactive_value = "false";
      if (_options?.prompt_options?.length >= 1) {
        active_value = _options?.prompt_options[0].value;
        inactive_value = _options?.prompt_options[1].value;
      }
      return await handle_questions(
        prompts({
          type: "toggle",
          name: "value",
          message: _options.prompt,
          initial: _options?.default_value,
          active: active_value,
          inactive: inactive_value,
        })
      );
    case Question_Types.Select_Single:
      if (_options?.prompt_options?.length < 1) {
        Error("No prompt choices passed");
      }

      return await handle_questions(
        prompts({
          type: "select",
          name: "value",
          message: _options.prompt,
          choices: _options?.prompt_options,
          initial: _options?.default_value,
        })
      );
    case Question_Types.Select_Multiple:
      if (_options?.prompt_options?.length < 1) {
        Error("No prompt choices passed");
      }

      return await handle_questions(
        prompts({
          type: "multiselect",
          name: "value",
          message: _options.prompt,
          choices: _options?.prompt_options,
          initial: _options?.default_value,
          min: _options?.min_select_amount,
          max: _options?.max_select_amount,
        })
      );
    case Question_Types.Input_String:
      return await handle_questions(
        prompts({
          type: "text",
          name: "value",
          message: _options.prompt,
          initial: _options?.default_value,
        })
      );
    case Question_Types.Input_Number:
      return await handle_questions(
        prompts({
          type: "number",
          name: "value",
          message: _options.prompt,
          initial: _options.default_value,
        })
      );
    case Question_Types.Input_List:
      return await handle_questions(
        prompts({
          type: "list",
          name: "value",
          message: _options.prompt,
          initial: _options?.default_value,
          separator: _options?.list_separator,
        })
      );
  }
}

/**
 *
 * @param {{}} _object
 * @param {string} _name
 * @constructor
 * @returns {void}
 */
export function Object(_object: {}, _name?: string): void {
  let formatted_output = "";
  if (_name) {
    formatted_output = `${_name} = `;
  }
  formatted_output += util.inspect(_object);
  stdout(formatted_output);
}

/**
 * Executes a shell command in the console as a child process
 * @param {string} _command
 * @param {(err, stdout, stderr) => void} _callback
 * @param {string} _directory
 * @constructor
 * @returns {void}
 */
export function Run(
  _command: string,
  _callback: (err, stdout, stderr) => void = cb__handle_run_default,
  _directory: string = process.cwd()
) {
  child_process.exec(_command, { cwd: _directory }, _callback);
}

/**
 *
 * @param _text
 * @param {[(FG_COLOURS | BG_COLOURS | STDOUT_MODIFIERS)] | FG_COLOURS | BG_COLOURS | STDOUT_MODIFIERS} _styles
 * @constructor
 * @returns {string}
 */
export function Colour(
  _text: string,
  _styles: [FG_COLOURS | BG_COLOURS | STDOUT_MODIFIERS] | FG_COLOURS | BG_COLOURS | STDOUT_MODIFIERS
): string {
  return _styles + _text + STDOUT_MODIFIERS.Reset;
}

/**
 *
 * @param {string | number | boolean} _line
 * @param {STDOUT_STYLE} _style
 * @returns {void}
 */
function stdout(
  _line: string | number | boolean = "",
  _style: STDOUT_STYLE = { modifier: STDOUT_MODIFIERS.Reset }
): void {
  // This will optionally combine the _style children, as long as they are not undefined/null.
  let style_glob = [_style.background_colour ?? "", _style.foreground_colour ?? "", _style.modifier ?? ""].join("");
  console.log(style_glob, _line);
}
