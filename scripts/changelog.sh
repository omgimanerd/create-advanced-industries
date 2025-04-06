#!/usr/bin/bash

if [[ -z $1 ]]; then
  START=$(git describe --tags --abbrev=0)
else
  START=$1
fi

echo '### New Mods / Major Changes'
echo '### Tweaks and Adustments'
echo '### Bugfixes'
git log --format='format:%s' "$START..HEAD" | tac | sed 's/^/- /'
