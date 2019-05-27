import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { BarCodeScanner, Permissions } from 'expo';
import { createStackNavigator } from 'react-navigation'
import { AsyncStorage } from 'react-native'
import * as paperWallet from '@discipl/paper-wallet'
import EphemeralConnector from '@discipl/core-ephemeral'
import { Octicons } from '@expo/vector-icons';
import {NavigationEvents} from 'react-navigation';

export default class App extends React.Component {
  static navigationOptions = {
    header: null,
  }
  render() {
    return <ScanStack />;
  }
}

class ScanScreen extends React.Component {
  static navigationOptions = {
    header: null,
  }
  state = {
    hasCameraPermission: null,
  }

  async componentDidMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });
  }

  render() {
    const { hasCameraPermission } = this.state;

    if (hasCameraPermission === null) {
      return <Text>Requesting for camera permission</Text>;
    }
    if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    }
    return (
      <View style={{ flex: 1 }}>
        <BarCodeScanner
          onBarCodeScanned={this.handleBarCodeScanned}
          style={StyleSheet.absoluteFill}
        />
      </View>
    );
  }

  handleBarCodeScanned = ({ type, data }) => {
    console.log('Navigating to validation screen')
    this.props.navigation.navigate('Validating', {qrString: data})
  }
}

class ValidatingScreen extends Component {
  constructor(props){
    super(props);
    this.state = {validatingState: "waiting"};
  }
  static navigationOptions = {
    headerTitle: 'Validatie',
  };
  _storeData = async (data) => {
    try {
      if (data) {
         await AsyncStorage.setItem("BRP1", data);
      }
    } catch (error) {
      console.log(error.message)
    }
  }
  async _checkQR() {
    const { navigation } = this.props;
    const qrString = await navigation.getParam('qrString', 'String not found');

    let certEndpoint = JSON.parse(qrString).metadata.cert

    let cert =  await fetch(certEndpoint)
      .then((response) => {
        return response.text()
      })
      .catch((e) => {
        console.log('Request failed', e)
        console.log(e.stack)
        console.log(e.message)
      })
    console.log('cert', cert)
    console.log('Registering ephemeral connector', EphemeralConnector)
    paperWallet.getCore().registerConnector('ephemeral', new EphemeralConnector())
    console.log('Importing attestorSsid')
    let attestorSsid = await (await paperWallet.getCore().getConnector('ephemeral')).newIdentity({'cert': cert})
    console.log("Validating...")
    this.result = await paperWallet.validate(attestorSsid.did, qrString)
    console.log(this.result)
  }

  async wrapperFunction() {
    await this._checkQR()
    console.log(this.result);
    if(this.result == null){
      this.setState({validatingState: "denied"})
    }
    else if(this.result == true){
      this.setState({validatingState: "verified"})
      this._storeData(this.qrString)
    }
  };

  render() {
    const verified = <Octicons name="verified" size={128} color="#33ff33" />;
    const denied = <Octicons name="alert" size={128} color="#FF0000" />;
    const waiting = <Octicons name="watch" size={128} color="#777777" />;

    let validatingIcon;
    let validatingText;
    if (this.state.validatingState == "waiting"){
      validatingIcon = waiting;
      validatingText = "Checking QR code"
    }
    if (this.state.validatingState == "verified"){
      validatingIcon = verified;
      validatingText = "This proof is valid!"
    }
    if (this.state.validatingState == "denied"){
      validatingIcon = denied;
      validatingText = "This is an unvalid QR-code!"
    }
    return (
      <View>
        <NavigationEvents onDidFocus={payload => this.wrapperFunction()}/>
        <Text>{validatingText}</Text>
        {validatingIcon}
      </View>
    );
  }
}

const ScanStack = createStackNavigator({
  Scan: ScanScreen,
  Validating: ValidatingScreen
});
