#!/bin/bash

mode="$1"
case $mode in
  "s" | "setup") # ?directory | ?bypass
    bash ./src/setup.sh "$2" "$3"
    ;;
  "u" | "uninstall") # uninstall-mode (all, self) | ?directory
    bash ./src/uninstall.sh "$2" "$3"
    ;;
  "i" | "integrate") # directory
    bash ./src/integrate.sh "$2"
    ;;
  "h" | "help")
    ;;
  *)
    echo "Unknown command passed"
    exit 1
    ;;
esac

exit 0