import * as util from "util";
import { Answer } from "./classes/Answer";
import { STDOUT_STYLE } from "./interfaces/STDOUT_STYLE";
import { Question_Types } from "./enums/Question_Types";
import { BG_COLOURS, FG_COLOURS, STDOUT_MODIFIERS } from "./enums/STDOUT";
import { Question_Options } from "./interfaces/Question_Options";

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

export function Error(_input): never {
  stdout(_input, { foreground_colour: FG_COLOURS.FgRed });
  process.exit(1);
}

export function Abort(_input = "Aborting", _code = 0): never {
  Line(_input);
  process.exit(_code);
}

export async function Question(opts: Question_Options): Promise<Answer> {
  const prompts = require("prompts");
  const t = require("./txt_utils");

  async function handle_single_val_question(q: typeof prompts) {
    return await q.then(
      (_resp) => {
        if (typeof _resp.value === "undefined") {
          Abort("Empty value passed. Aborting!");
        } else {
          return new Answer(opts.prompt_type, [{ index: 0, value: _resp.value }]);
        }
      },
      (reason) => {
        Error(reason);
      }
    );
  }

  switch (opts.prompt_type) {
    case Question_Types.Input_Boolean:
      return await handle_single_val_question(
        prompts({
          type: "confirm",
          name: "value",
          message: opts.prompt,
          initial: t.parse_string_to_boolean(opts.default_value),
        })
      );
    case Question_Types.Select_Single:
      return await handle_single_val_question(
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
      return await handle_single_val_question(
        prompts({
          type: "text",
          name: "value",
          message: opts.prompt,
          initial: opts?.default_value,
        })
      );
    case Question_Types.Input_Number:
      return await handle_single_val_question(
        prompts({
          type: "number",
          name: "value",
          message: opts.prompt,
          initial: opts.default_value,
        })
      );
  }
}

export function Object(_object: {}, _name?: string): void {
  let _o = "";
  if (_name) {
    _o = `${_name} = `;
  }
  _o += util.inspect(_object);
  stdout(_o);
}

export function Run(_command, _callback?, _directory = process.cwd()) {
  const child_process = require("child_process");
  if (_callback === undefined) {
    child_process.exec(_command, { cwd: _directory }, (error, stdout, stderr) => {
      if (error) {
        Error(`Error occurred while executing command: \`${_command}\` in directory: ${_directory}`);
      } else if (stdout) {
        Line(stdout);
      }
    });
  } else {
    child_process.exec(_command, { cwd: _directory }, _callback);
  }
}

export function Colour(
  _text,
  _styles: [FG_COLOURS | BG_COLOURS | STDOUT_MODIFIERS] | FG_COLOURS | BG_COLOURS | STDOUT_MODIFIERS
) {
  return _styles + _text + STDOUT_MODIFIERS.Reset;
}

function stdout(
  _line: string | number | boolean = "",
  _style: STDOUT_STYLE = { modifier: STDOUT_MODIFIERS.Reset }
): void {
  // This will optionally combine the _style children, as long as they are not undefined/null.
  let style_glob = [_style.background_colour ?? "", _style.foreground_colour ?? "", _style.modifier ?? ""].join("");
  console.log(style_glob, _line);
}
