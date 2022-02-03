import * as util from "util";
import { Answer } from "./classes/Answer";
import { STDOUT_STYLE } from "./interfaces/STDOUT_STYLE";
import { Question_Types } from "./enums/Question_Types";
import { BG_COLOURS, FG_COLOURS, STDOUT_MODIFIERS } from "./enums/STDOUT";
import { Question_Options } from "./interfaces/Question_Options";
import { cb__handle_run_default } from "./callbacks";
import * as child_process from "child_process";

/**
 * Prints out a paragraph of texts to the console.
 * @param {string[]} _input The array of strings to print.
 * @param {boolean} _spacing T/F: Add a blank new line after the paragraph. Default is true which adds the empty line.
 * @constructor
 */
export function Paragraph(_input: string[], _spacing = true) {
  _input.forEach((value) => stdout(value));
  if (_spacing) {
    Empty();
  }
}

/**
 * Prints out each element in an array in a list form.
 * @param {any[]} _list The array to print out
 * @param _line_prefix The character to prefix each new line in the list with. Adds a space at the end. Default is "*"
 * @constructor
 */
export function List(_list: any[], _line_prefix: string = "*") {
  _list.forEach((value) => stdout(`* ${value}`));
}

/**
 * Prints out a line of repeating text to divide the console.
 * @param {number} rows The number of rows the divider should be. Default is 1
 * @param {number} length The length/width of each row. Default is 90 character
 * @param {string} pattern The character/string to repeat. Default is "="
 * @constructor
 */
export function Divider(rows: number = 1, length: number = 90, pattern: string = "=") {
  for (let i = 0; i < rows; i++) {
    stdout(pattern.repeat(Math.round(length / pattern.length)));
  }
}

/**
 * Prints a line of text to the console.
 * @param {string | number | boolean} _output The message that will be printed out to the console
 * @constructor
 */
export function Line(_output: string | number | boolean): void {
  stdout(_output);
}

/**
 * Prints an empty line to the console.
 * @constructor
 */
export function Empty(): void {
  stdout();
}

/**
 * Outputs an error, and aborts the process.
 * @param {string | number | boolean} _error_message The message that will be printed out to the console
 * @returns {never}
 * @constructor
 */
export function Error(_error_message: string | number | boolean): never {
  stdout(_error_message, { foreground_colour: FG_COLOURS.FgRed });
  process.exit(1);
}

/**
 * Aborts the process.
 * @param {string} _abort_message The message that will be printed to the console before aborting. Default is "Aborting"
 * @param {number} _code The process exit code. Default is 0
 * @returns {never}
 * @constructor
 */
export function Abort(_abort_message = "Aborting", _code = 0): never {
  Line(_abort_message);
  process.exit(_code);
}

/**
 *
 * @param {Question_Options} opts
 * @returns {Promise<Answer>}
 * @constructor
 */
export async function Question(opts: Question_Options): Promise<Answer> {
  const prompts = require("prompts");
  const t = require("./txt_utils");

  async function handle_questions(q: typeof prompts): Promise<Answer> {
    return await q.then(
      (_resp, _interrupt) => {
        if (typeof _resp.value === "undefined" || _interrupt) {
          Abort("Empty value passed. Aborting!");
        } else {
          return typeof _resp.value === "object"
            ? new Answer(opts.prompt, _resp) // If the response is an array, return it unchanged
            : new Answer(opts.prompt_type, [_resp]); // If it's anything else, wrap it in an array
        }
      },
      (reason) => {
        Error(reason);
      }
    );
  }

  switch (opts.prompt_type) {
    case Question_Types.Input_Boolean:
      return await handle_questions(
        prompts({
          type: "confirm",
          name: "value",
          message: opts.prompt,
          initial: t.parse_string_to_boolean(opts.default_value),
        })
      );
    case Question_Types.Toggle:
      return await handle_questions(
        prompts({
          type: "toggle",
          name: "value",
          message: opts.prompt,
          initial: opts?.default_value,
          active: opts?.prompt_options[0],
          inactive: opts?.prompt_options[1],
        })
      );
    case Question_Types.Select_Single:
      return await handle_questions(
        prompts({
          type: "select",
          name: "value",
          message: opts.prompt,
          choices: opts?.prompt_options,
          initial: opts?.default_value,
        })
      );
    case Question_Types.Select_Multiple:
      return await handle_questions(
        prompts({
          type: "multiselect",
          name: "value",
          message: opts.prompt,
          choices: opts?.prompt_options,
          initial: opts?.default_value,
          min: opts?.min_select_amount,
          max: opts?.max_select_amount,
        })
      );
    case Question_Types.Input_String:
      return await handle_questions(
        prompts({
          type: "text",
          name: "value",
          message: opts.prompt,
          initial: opts?.default_value,
        })
      );
    case Question_Types.Input_Number:
      return await handle_questions(
        prompts({
          type: "number",
          name: "value",
          message: opts.prompt,
          initial: opts.default_value,
        })
      );
    case Question_Types.Input_List:
      return await handle_questions(
        prompts({
          type: "list",
          name: "value",
          message: opts.prompt,
          initial: opts?.default_value,
          separator: opts?.list_separator,
        })
      );
  }
}

/**
 *
 * @param {{}} _object
 * @param {string} _name
 * @constructor
 */
export function Object(_object: {}, _name?: string): void {
  let _o = "";
  if (_name) {
    _o = `${_name} = `;
  }
  _o += util.inspect(_object);
  stdout(_o);
}

/**
 *
 * @param _command
 * @param {(error, stdout, stderr) => void} _callback
 * @param {string} _directory
 * @constructor
 */
export function Run(_command, _callback = cb__handle_run_default, _directory = process.cwd()) {
  child_process.exec(_command, { cwd: _directory }, _callback);
}

/**
 *
 * @param _text
 * @param {[(FG_COLOURS | BG_COLOURS | STDOUT_MODIFIERS)] | FG_COLOURS | BG_COLOURS | STDOUT_MODIFIERS} _styles
 * @returns {any}
 * @constructor
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
 */
function stdout(
  _line: string | number | boolean = "",
  _style: STDOUT_STYLE = { modifier: STDOUT_MODIFIERS.Reset }
): void {
  // This will optionally combine the _style children, as long as they are not undefined/null.
  let style_glob = [_style.background_colour ?? "", _style.foreground_colour ?? "", _style.modifier ?? ""].join("");
  console.log(style_glob, _line);
}
