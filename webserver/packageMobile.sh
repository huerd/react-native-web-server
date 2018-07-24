#!/bin/bash
set -e
if [ $# -eq 0 ]
then
  echo "Specify a target: ios, android"
  exit
fi

gomobile bind -target $1 -v
