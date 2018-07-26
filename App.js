import React from 'react';
import { StyleSheet, Text, View, Button, WebView, NativeModules, Dimensions, TouchableOpacity, SafeAreaView, Platform } from 'react-native';

var RNFS = require('react-native-fs');

const AppWebServer = NativeModules.AppWebServer;

const IS_ANDROID = Platform.OS === 'android';
const IS_IOS = Platform.OS === 'ios';

export default class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      serverRunning: false,
      serverUrl: '',
      pingUrl: ''
    }
    this.handleServerStart = this.handleServerStart.bind(this);
    this.handleServerStop = this.handleServerStop.bind(this);
    this.renderAppServerStatusBar = this.renderAppServerStatusBar.bind(this);
    this.handleStatusBarClick = this.handleStatusBarClick.bind(this);
    this.heartbeatCheck = this.heartbeatCheck.bind(this);
  }

  heartbeatCheck = () => {
    AppWebServer.isRunning().then(serverRunning => {
      const running = IS_ANDROID ? serverRunning : serverRunning === 'true';
      this.setState({serverRunning:running});
      if (running) {
        AppWebServer.serverUrl().then(serverUrl => {
          this.state.serverUrl !== serverUrl && this.setState({serverUrl, pingUrl:`${serverUrl}/ping`});
        });
      }
    });
  }

  componentDidMount() {
    this.timeoutId = setInterval(() => {
      this.heartbeatCheck();
    }, 1000 * 5);
    this.heartbeatCheck();
  }

  componentWillUnmount() {
    clearInterval(this.timeoutId);
  }

  handleStatusBarClick() {
    const { serverRunning } = this.state;
    serverRunning ? this.handleServerStop() : this.handleServerStart();
  }

  async handleServerStart() {
    try {
      const serverUrl = await AppWebServer.start(`${RNFS.MainBundlePath}`)
      this.setState({serverUrl, pingUrl:`${serverUrl}/ping`, serverRunning:true});
    } catch (ex) {
      alert(ex);
    }
  }

  async handleServerStop() {
    try {
      await AppWebServer.stop();
      this.setState({serverUrl:'', serverRunning:false});
    } catch (ex) {
      alert(ex);
    }
  }

  renderAppServerStatusBar() {
    const { serverRunning } = this.state;
    return (
      <View>
        <TouchableOpacity
          style={styles.serverStatusBar}
          onPress={this.handleStatusBarClick}>
          <Text style={styles.serverStatusBarText}>
            { serverRunning ?
              'In-app server running. Click to shutdown.'
                :
              'In-app server not running. Click to start.'
            }
          </Text>
        </TouchableOpacity>
      </View>
    )
  }

  render() {
    const { serverRunning, serverUrl, pingUrl } = this.state;
    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.container}>
          { this.renderAppServerStatusBar() }
          <View style={styles.webViewContainer}>
            <Text style={styles.infoText}>React Native Web View { serverUrl && pingUrl } </Text>
            <WebView
              style={styles.webView}
              source={{uri:serverUrl ? pingUrl : undefined}}/>
          </View>
        </SafeAreaView>
      </View>
    );
  }
}

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'lightgray',
  },
  webViewContainer: {
    flex:1,
    padding:20
  },
  webView: {
    flex:1,
    backgroundColor:'white'
  },
  infoText: {
    fontWeight:'bold',
    paddingBottom:10
  },
  serverStatusBar: {
    width:screenWidth,
    height:30,
    backgroundColor:'#FFB74D',
    justifyContent:'center'
  },
  serverStatusBarText: {
    fontWeight:'bold',
    color:'white',
    textAlign:'center'
  }
});
