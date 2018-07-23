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
  }

  componentDidMount() {
    this.timeoutId = setInterval(() => {
      AppWebServer.isRunning().then(serverRunning => {
        this.setState({serverRunning: serverRunning === 'true'});
      });
    }, 1000 * 5);
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
          style={{width:Dimensions.get('window').width, height:30, backgroundColor:'#FFB74D', justifyContent:'center'}}
          onPress={this.handleStatusBarClick}>
          <Text style={{fontWeight:'bold', color:'white', textAlign:'center'}}>
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
          <WebView
            style={styles.webView}
            source={{uri:serverUrl ? `${serverUrl}/ping` : undefined}}/>
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
  webView: {
    flex:1,
    backgroundColor:'white',
    margin:10
  }
});
