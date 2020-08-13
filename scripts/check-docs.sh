#!/bin/bash

if [[ "$(git status --porcelain)" ]]; then
    echo "The root README has not been updated. Run 'yarn generate docs' in the root of your Quilt directory and try again."
    exit 1
fi
