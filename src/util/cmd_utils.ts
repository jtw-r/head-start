import * as util from "util";
import { Answer } from "./classes/Answer";
import { STDOUT_STYLE } from "./interfaces/STDOUT_STYLE";
import { Question_Types } from "./enums/Question_Types";
import { BG_COLOURS, FG_COLOURS, STDOUT_MODIFIERS } from "./enums/STDOUT";
import { Question_Options } from "./interfaces/Question_Options";
import { cb__handle_run_default } from "./callbacks";
import * as child_process from "child_process";

/**
 *
 * @param {string[]} _input
 * @param {boolean} _spacing
 * @constructor
 */
export function Paragraph(_input: string[], _spacing = true) {
  _input.forEach((value) => stdout(value));
  if (_spacing) {
    stdout();
  }
}

/**
 *
 * @param {string[]} _input
 * @constructor
 */
export function List(_input: string[]) {
  _input.forEach((value) => stdout(`* ${value}`));
}

/**
 *
 * @param {number} _width
 * @constructor
 */
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

/**
 *
 * @constructor
 */
export function Empty(): void {
  stdout();
}

/**
 *
 * @param _input
 * @returns {never}
 * @constructor
 */
export function Error(_input): never {
  stdout(_input, { foreground_colour: FG_COLOURS.FgRed });
  process.exit(1);
}

/**
 *
 * @param {string} _input
 * @param {number} _code
 * @returns {never}
 * @constructor
 */
export function Abort(_input = "Aborting", _code = 0): never {
  Line(_input);
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

  async function handle_questions(q: typeof prompts) {
    return await q.then(
      (_resp) => {
        if (typeof _resp.value === "undefined") {
          Abort("Empty value passed. Aborting!");
        } else {
          if (_resp.value.isArray()) {
            // This code hasn't actually been tested
            let _a = new Answer(opts.prompt, []);
            _resp.value.forEach((answer_value) => {
              _a.responses.push({ index: 0, value: answer_value });
            });
            return _a;
          } else {
            return new Answer(opts.prompt_type, [{ index: 0, value: _resp.value }]);
          }
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
      break;
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
