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
  kubejs/probe\*
