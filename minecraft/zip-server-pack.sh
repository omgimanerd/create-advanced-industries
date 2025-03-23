#!/usr/bin/env bash

zip server-pack-$(git describe --tags --abbrev=0).zip \
  -r \
  config \
  defaultconfigs \
  kubejs \
  mods \
  icon.png \
  server.properties \
  start.sh \
  variables.txt \
  -x \
  '*config/jei/world/*' \
  '*config/fancymenu/*' \
  '*kubejs/assets/kubejs/textures/fluid/__pycache__/*' \
  '*kubejs/probe*' \
  '*mods/probejs*' \
  '*mods/Xaeros*'
