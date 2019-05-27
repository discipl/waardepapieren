import React, { Component } from 'react';
import { StyleSheet, FlatList, Text, View } from 'react-native';
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
    const { navigation } = this.props;
    navigation.addListener('willFocus', () =>
      this.setState({ focusedScreen: true })
    );
    navigation.addListener('willBlur', () =>
      this.setState({ focusedScreen: false })
    );
  }

  render() {
    const { hasCameraPermission, focusedScreen } = this.state;

    if (hasCameraPermission === null) {
      return <Text>Requesting for camera permission</Text>;
    }
    if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    }
    if (!focusedScreen) {
      return <Text>You are not on this screen. If you are, something went wrong</Text>;
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

  async renderClaimData(){
    if(this.state.validatingState == "verified"){
      let claimData = await this._readData();
      this.setState({claimData: claimData})
      let renderData = await this._renderData();
      this.setState({renderData: renderData})
    }
  }

  _storeData = async (data) => {
    try {
      if (data) {
        await AsyncStorage.setItem("BRP1", data);
      }
    } catch (error) {
      console.log(error.message)
    }
  }

  _readData = async () => {
    let displayData = await this.state.qrString;
    let documentJson = JSON.parse(displayData).claimData;
    let claimWithLink = Object.values(documentJson)[0][0];
    let claimData = Object.values(claimWithLink)[0];
    return claimData;
  }

  _renderData = async () => {
    let claimData = this.state.claimData;
    let result = []
    for(var i = 0; i < claimData.length; i++){
      let entry = {};
      entry.key = Object.keys(claimData[i])[0];
      entry.value = Object.values(claimData[i])[0];
      console.log(entry);
      result.push(<Text key={entry.key} value={entry.value}/>)
    }
    console.log(result);
    return result;
  }

  async _checkQR() {
    const { navigation } = this.props;
    const qrString = await navigation.getParam('qrString', 'String not found');

    let certEndpoint = JSON.parse(qrString).metadata.cert

    console.log('Fetching', certEndpoint)

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

    this.setState({qrString: qrString})

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
      this._storeData(this.state.qrString)
      this.renderClaimData()
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
      <View style={styles.container}>
        <View style={styles.validateState}>
          <NavigationEvents onDidFocus={payload => this.wrapperFunction()}/>
          <Text style ={styles.key}>{validatingText}</Text>
          {validatingIcon}
        </View>

        <FlatList
          data={this.state.renderData}
          showsVerticalScrollIndicator={false}
          renderItem={({item}) =>
          <View style={styles.flatview}>
            <Text style={styles.key}>{item.key}</Text>
            <Text style={styles.value}>{item.props.value}</Text>
          </View>
          }
          keyExtractor={item => item.key}
        />
      </View>
    );
  }
}

const ScanStack = createStackNavigator({
  Scan: ScanScreen,
  Validating: ValidatingScreen
});

const styles = StyleSheet.create({
  container: {
   backgroundColor: 'white',
   flex: 1,
  },
  key: {
    padding: 10,
    fontSize: 20,
    height: 48,
    fontWeight: 'bold',
  },
  value: {
    padding: 10,
    fontSize: 16,
    height: 41,
    color: '#666666'
  },
  validateState: {
    flex:3,
    flexDirection:'column',
    alignItems:'center',
    justifyContent:'center'
    },
  flatview: {
    backgroundColor: '#F6F6F6',
    borderTopWidth: 2,
    borderTopColor: '#DDDDDD'
  }
})
