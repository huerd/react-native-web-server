import React from 'react';
import { StyleSheet, Text, View, Button, WebView, NativeModules, Dimensions, TouchableOpacity, SafeAreaView } from 'react-native';

var RNFS = require('react-native-fs');

const AppWebServer = NativeModules.AppWebServer;

export default class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      serverRunning: false,
      serverUrl: ''
    }
    this.handleServerStart = this.handleServerStart.bind(this);
    this.handleServerStop = this.handleServerStop.bind(this);
    this.renderAppServerStatusBar = this.renderAppServerStatusBar.bind(this);
    this.handleStatusBarClick = this.handleStatusBarClick.bind(this);
    this.heartbeatCheck = this.heartbeatCheck.bind(this);
  }

  heartbeatCheck = () => {
    AppWebServer.isRunning().then(serverRunning => {
      this.setState({serverRunning: serverRunning === 'true'});
      if (serverRunning === 'true') {
        AppWebServer.serverUrl().then(serverUrl => {
          this.state.serverUrl !== serverUrl && this.setState({serverUrl});
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

  handleServerStart() {
    AppWebServer.start(`${RNFS.MainBundlePath}`, serverUrl => {
      if (serverUrl) {
        this.setState({serverUrl,serverRunning:true});
      }
    });
  }

  handleServerStop() {
    AppWebServer.stop();
    this.setState({serverUrl:'', serverRunning:false});
  }

  renderAppServerStatusBar() {
    const { serverRunning } = this.state;
    return (
      <View>
        <TouchableOpacity
          style={styles.serverStatusBar}
          onPress={this.handleStatusBarClick}>
          <Text style={styles.serverStatusBarText}>
            { serverRunning && 'In-app server running. Click to shutdown.' }
            { !serverRunning && 'In-app server not running. Click to start.' }
          </Text>
        </TouchableOpacity>
      </View>
    )
  }

  render() {
    const { serverRunning, serverUrl } = this.state;
    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.container}>
          { this.renderAppServerStatusBar() }
          <View style={styles.webViewContainer}>
            <Text style={styles.infoText}>React Native Web View { serverUrl && ' - ' + serverUrl + '/ping' } </Text>
            <WebView
              style={styles.webView}
              source={{uri:serverUrl ? `${serverUrl}/ping` : undefined}}/>
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
