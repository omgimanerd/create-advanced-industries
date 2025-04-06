#!/usr/bin/bash

if [[ -z $1 ]]; then
  START=$(git describe --tags --abbrev=0)
else
  START=$1
fi

git log --format='format:%s' "$START..HEAD" | tac
