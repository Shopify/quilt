#!/bin/bash

test -z "$(git status --porcelain)" || echo "The root README has not been updated. Run 'yarn generate docs' in the root of your Quilt directory and try again."
