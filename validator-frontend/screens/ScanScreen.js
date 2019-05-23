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
    let documentJson = JSON.parse(displayData);
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
    this.setState({qrString: qrString})
    let cert =  '   -----BEGIN CERTIFICATE-----  '  +
      '   MIIFzzCCA7egAwIBAgIUBDAnPgMV5iH+LkMfm6h5E8jWVOswDQYJKoZIhvcNAQEN  '  +
      '   BQAwXzELMAkGA1UEBhMCTkwxFjAUBgNVBAgTDU5vb3JkLUhvbGxhbmQxEjAQBgNV  '  +
      '   BAcTCUFtc3RlcmRhbTEWMBQGA1UEChMNQ29tbW9uIEdyb3VuZDEMMAoGA1UECxMD  '  +
      '   TkxYMB4XDTE5MDExMDEyMTIwMFoXDTIwMDExMDEyMTIwMFowYzELMAkGA1UEBhMC  '  +
      '   TkwxFTATBgNVBAgTDFp1aWQtSG9sbGFuZDERMA8GA1UEBxMIRGVuIEhhYWcxDTAL  '  +
      '   BgNVBAoTBElDVFUxGzAZBgNVBAsTElN5c3RlbSBUZXN0IFRyYXZpczCCAiIwDQYJ  '  +
      '   KoZIhvcNAQEBBQADggIPADCCAgoCggIBAK/9d/G5sOy4JQ6mqp/YG/jRo5KFytLe  '  +
      '   K4i5sIPFviP9TixolyF1YrrVpOvYtJOI7mVcfsSuNvB4WRX4zMw559oLH1WOBfye  '  +
      '   Tr3Y1t8uGNlb0v0nqN/DDpT9LyFm+rMw/AiA3XwInPPB80cZ6jOoABb2KX/MJj3D  '  +
      '   4AS0osnW9uY91iYsyMXiCaEl84f/MMXQLGgRfK9PKLbWGIm0OJVScOtz3ZuppK9N  '  +
      '   VIJWnhVpJZciVUhlb3b2uxM8oAz7WcuayUv1tlKrxSMnG3/Bhm7HfuF9jhmUoiOH  '  +
      '   N7rOSCWlOL5YB9rz+I4kQFe/g2gOVWk1jPk1N8Fa+R57Hdcn12zCD91zVGCZH23x  '  +
      '   2SirPHauhvetrsbNwMyQDXeA7pM5f3mLqavMGb55m8VHl1hA+nbwvIOEBwlSTvLu  '  +
      '   9ajM7tS8rm8Pic2g5eJM2klArdkrvtdW6RAK33TbsqTKZl+/IxUppZah5XbAdljp  '  +
      '   2Q6cFmpvcGSwVBfk2Av9XD8ggpZ9L6+ph2k22bTSGOLJrqhN4FE22w+FfokoZmeH  '  +
      '   6x2LNIdpag4BS17UbAshRhEjA28vUuEjYgsiGR+KhNffdN71SLzdh51QkWqLjgp4  '  +
      '   zk/IFy+1IbzdN9iG0uDeZ9Rs57QmXZZ3FYHjjX86BUOlEQjffujN1IwmW2bhuO3F  '  +
      '   KqRUe82r0I5dAgMBAAGjfzB9MA4GA1UdDwEB/wQEAwIFoDAdBgNVHSUEFjAUBggr  '  +
      '   BgEFBQcDAQYIKwYBBQUHAwIwDAYDVR0TAQH/BAIwADAdBgNVHQ4EFgQUROK+AQOb  '  +
      '   xKImWwYqxlonqTVG5rMwHwYDVR0jBBgwFoAUWuBBURGHrNpoh8AAwwZc4nktif0w  '  +
      '   DQYJKoZIhvcNAQENBQADggIBAK3rJFJ79/zog8PaDJumkB0myRkxi8etKQrFEbAn  '  +
      '   zrPRtayNhoR7a6WYHQASxcYTo9wV7lyxvdHdwgL7+mcsAuwHzGsnBN3pvZXqrCv0  '  +
      '   YO3nvCvc35P8dMPuN57rxth6z04ql/nSXSQa89v2viEK34bYs+Ai7c9hg2d6MQrN  '  +
      '   s7NpD2j3FxJmT7aIEYt8p/xkr5GNq48APu2mqDll3ZJhSVKgNuz2kRkJopJFvS3s  '  +
      '   ybpGShwGlScaY8TVukP9XLrfUG30G3/AcD0A9XHqOomWsPmcFLrzA4qi1XFcwTqe  '  +
      '   +yIvL/y3c2HQjW1zQ8JaqV/bnCQIdAjJ5Qomqlm02jtNqKdLftsqkhcVQ1T0Y+/C  '  +
      '   +j3jZybRPTXw8XXGug0/x31NqzjaPip5lXAOzHaf+8xqt3KOtKzV+12VCSnoaOIJ  '  +
      '   x/a0J5unqVBdZlNWsg222q8njavUSQWIRoYxGpWHxmQoBDBD4bQK9JiOpBcsOXCu  '  +
      '   3egjBowvyBWgTfY8LLXEX1ZSzY2mljaAsYuSeFGHepmAmXGPXU4TkfREzO062gAB  '  +
      '   uGWmuzbxWbvz79zhlaWTbdLMpW6VdgQty3Ua9LEOuKzK2dSsPrd4YEXSc4AywuqJ  '  +
      '   5sdnzFa4dJKrDcBws5JmetneJpaote4Hqicj5t4leOutIFFwb7J/8xDzpc9qgFvE  '  +
      '   eyB5  '  +
      '   -----END CERTIFICATE-----  '  +
      '    ' ;
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
        <NavigationEvents onDidFocus={payload => this.wrapperFunction()}/>
        <Text style ={styles.key}>{validatingText}</Text>
        {validatingIcon}

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
  flatview: {
    backgroundColor: '#F6F6F6',
    borderTopWidth: 2,
    borderTopColor: '#DDDDDD'
  }
})
