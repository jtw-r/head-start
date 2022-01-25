#!/bin/bash

function get_user_input()
{
  local __user_input
  read -r -p "$1 " __user_input
  __user_input="$(echo "$__user_input" | tr '[:upper:]' '[:lower:]')"
  echo "$__user_input"
}