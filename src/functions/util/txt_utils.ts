export function parse_string_to_boolean(_input: string): boolean {
  let output: boolean;
  switch (_input) {
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
