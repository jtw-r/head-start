export function parse_string_to_boolean(_input: string | boolean): boolean {
  if (typeof _input === "string") {
    _input = _input.toLowerCase();
  }
  switch (_input) {
    case true:
    case "y":
    case "yes":
    case "yep":
    case "yessir":
    case "t":
    case "true":
    case "correct":
    case "+":
    case "positive":
      return true;
    case false:
    case "n":
    case "no":
    case "nope":
    case "nah":
    case "nosir":
    case "f":
    case "false":
    case "incorrect":
    case "-":
    case "negative":
      return false;
    default:
      return null;
  }
}
