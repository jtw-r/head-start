#!/bin/bash

if [ -n "$1" ]
then
  mode="$1"
  case $mode in
    "init" | "initialize") # ?directory | ?bypass
      bash ./src/.head_start/commands/init.sh "$2" "$3"
      ;;
    "u" | "uninstall") # uninstall-mode (all, self) | ?directory
      bash ./src/.head_start/commands/uninstall.sh "$2" "$3"
      ;;
    "int" | "integrate") # directory
      bash ./src/.head_start/commands/integrate.sh "$2"
      ;;
    "h" | "help")
      ;;
    *)
      echo "Unknown command passed"
      exit 1
      ;;
  esac
else
  echo ""
  echo "===================================================="
  echo "Welcome to Head-start!"
  echo ""
  echo "If you need help, run this script with h or help tag"
  echo "===================================================="
  echo ""
fi


exit 0