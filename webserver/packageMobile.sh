#!/bin/bash
set -e
IOS_DEST=../ios/DerivedData/ReactNativeWebServer/Build/Products/Debug-iphonesimulator
IOS_FRAMEWORK_FILE=Webserver.framework

if [ $# -eq 0 ]
then
  echo "Specify a target: ios, android"
  exit
fi

gomobile bind -target $1 -v

if [ $1 = "ios" ]; then
  if [ ! -f "$IOS_DEST/$IOS_FRAMEWORK_FILE" ]; then
    rm -rf "$IOS_DEST/$IOS_FRAMEWORK_FILE"
  fi
  mv $IOS_FRAMEWORK_FILE $IOS_DEST
fi
