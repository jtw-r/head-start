#!/bin/bash
echo "Operating directory: ${PWD##*/}"
SCRIPT_DIR="$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
echo "$SCRIPT_DIR"
mkdir .github
cp "$SCRIPT_DIR"/../setup_assets/deploy-to-branch.yml .github/deploy-to-branch.yml