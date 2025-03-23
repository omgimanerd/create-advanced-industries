#!/usr/bin/env bash

for f in *_hover.png; do
  dim=$(identify -format "%w %h" $f);
  w=$(echo $dim | awk '{print $1}');
  h=$(echo $dim | awk '{print $2}');
  ratio=$(echo "scale=3; $w / $h" | bc);
  printf "%-25s %6.3f\n" $f $ratio
done
