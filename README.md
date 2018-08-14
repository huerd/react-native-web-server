# react-native-web-server
An embeddable dynamic web-server backed by Golang for React Native apps ( IOS & Android ).

![](https://s3.amazonaws.com/battousai/ReactNativeWebServer.gif)

## How to use this project

The recommended way is to clone / fork this project and use it as a template for your react native app. See the Installation section below.

## Additional dependencies
* Golang : See https://golang.org/doc/install ( At least Go 1.7 is required )
* Gomobile: https://github.com/golang/go/wiki/Mobile

## Installing Gomobile

```
$ go get golang.org/x/mobile/cmd/gomobile
$ gomobile init # it might take a few minutes
```

See here for more details: https://github.com/golang/go/wiki/Mobile

## Installation

1. Clone the repo at `$GOPATH/src/` or `$HOME/go/src/` 
2. `git clone git@github.com:hemantasapkota/react-native-web-server.git`
3. Grab node modules: `cd react-native-web-server && npm install`

## Package the webserver for IOS

1. First build the Xcode project and expect it to fail

```
open ios/ReactNativeWebServer.xcodeproj
```

If everything goes well, the first build will fail because of the missing server framework

2. Package the webserver

```
cd ../ && cd webserver
./packagemobile.sh ios
```
The output of the script is a dynamic framework called `Webserver.framework`. Copy Webserver.framework to the DerivedData folder using the following command:

```
mv Webserver.framework ../ios/DerivedData/ReactNativeWebServer/Build/Products/Debug-iphonesimulator
```

## Roadmap

* Enable integration as a node module for existing react native apps
