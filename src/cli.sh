#!/bin/bash

mode="$1"
case $mode in
  "init" | "initialize") # ?directory | ?bypass
    bash ./src/commands/init.sh "$2" "$3"
    ;;
  "u" | "uninstall") # uninstall-mode (all, self) | ?directory
    bash ./src/commands/uninstall.sh "$2" "$3"
    ;;
  "int" | "integrate") # directory
    bash ./src/commands/integrate.sh "$2"
    ;;
  "h" | "help")
    ;;
  *)
    echo "Unknown command passed"
    exit 1
    ;;
esac

exit 0