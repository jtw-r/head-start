#!/usr/bin/env node

const prompts = require("prompts");

let a = "";

let response = Promise.resolve(
  prompts({
    type: "confirm",
    name: "value",
    message: "Demo Prompt",
    initial: false,
  })
).then((value) => {
  a = value;
});

console.log(`our value is ${a}`);
