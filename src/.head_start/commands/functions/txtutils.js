exports.Paragraph = function (_input = [], _spacing = true) {
  _input.forEach((value) => stdout(value));
  if (_spacing) {
    stdout();
  }
};

exports.List = function (_input = []) {
  _input.forEach((value) => stdout("* " + value));
};

exports.Divider = function (_width = 1) {
  for (let i = 0; i < _width; i++) {
    stdout("=".repeat(90));
  }
};

exports.Line = function (_input) {
  stdout(_input);
};

exports.Empty = function () {
  stdout();
};

exports.Error = function (_input) {
  stdout(_input, "error");
};

exports.Question = function (_input, _default) {
  const prompt = require("prompt-sync")({ sigint: true });
  //return prompt(_input, _default);

  const prompts = require("prompts");
  (async () => {
    const response = await prompts({
      type: "text",
      name: "Question",
      message: _input,
    });

    return response.Question;
  })();
};

function stdout(_line = "", _type = "log") {
  switch (_type) {
    default:
    case "log":
      console.log(_line);
      break;
    case "error":
      console.error(_line);
      break;
  }
}
