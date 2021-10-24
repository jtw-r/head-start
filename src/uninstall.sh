#!/bin/bash

mode="$1"
directory="$2"

function get_user_input()
{
  local __user_input
  read -r -p "$1 " __user_input
  __user_input="$(echo "$__user_input" | tr '[:upper:]' '[:lower:]')"
  echo "$__user_input"
}

if [ -n "$directory" ]
then
  directory+="/"
fi

case $mode in
  "a" | "all")
    echo "WARNING: The command you are executing will delete ALL FILES from these directories:"
    echo " - ${directory}build/"
    echo " - ${directory}node_modules/"
    echo " - ${directory}src/"
    echo ""
    echo "WARNING: The command you are executing will also delete ALL FILES listed below:"
    echo " - ${directory}package.json"
    echo " - ${directory}package-lock.json"
    echo " - ${directory}tsconfig.json"
    echo ""
    consent=$(get_user_input "ARE YOU SURE YOU WOULD LIKE TO PROCEED? (Y/N)")
    case $consent in
      "y" | "yes" | "true")
        echo "Removing files"
        rm -rf ${directory}src/ ${directory}build/ ${directory}node_modules/ ${directory}package.json ${directory}package-lock.json ${directory}tsconfig.json
        exit 0
        ;;
      "n" | "no" | "false")
        echo "Aborting"
        exit 0
        ;;
      *)
        echo "Unknown input detected. Aborting to prevent accidental data-loss"
        exit 0
        ;;
    esac
    ;;
  "s" | "self")
    rm -rf setup/
    ;;
  *)
    echo "Unknown option passed"
    exit 1
    ;;
esac

exit 0