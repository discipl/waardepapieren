import React, { Component } from 'react';
import { StyleSheet, FlatList, Text, View, Alert } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner'
import * as Permissions from 'expo-permissions'
import { createStackNavigator } from 'react-navigation'
import { AsyncStorage } from 'react-native'
import { PaperWallet } from '@discipl/paper-wallet'


const realRootCA = "-----BEGIN CERTIFICATE-----\n" +
  "MIIFcDCCA1igAwIBAgIEAJiWjTANBgkqhkiG9w0BAQsFADBYMQswCQYDVQQGEwJO\n" +
  "TDEeMBwGA1UECgwVU3RhYXQgZGVyIE5lZGVybGFuZGVuMSkwJwYDVQQDDCBTdGFh\n" +
  "dCBkZXIgTmVkZXJsYW5kZW4gRVYgUm9vdCBDQTAeFw0xMDEyMDgxMTE5MjlaFw0y\n" +
  "MjEyMDgxMTEwMjhaMFgxCzAJBgNVBAYTAk5MMR4wHAYDVQQKDBVTdGFhdCBkZXIg\n" +
  "TmVkZXJsYW5kZW4xKTAnBgNVBAMMIFN0YWF0IGRlciBOZWRlcmxhbmRlbiBFViBS\n" +
  "b290IENBMIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEA48d+ifkkSzrS\n" +
  "M4M1LGns3Amk41GoJSt5uAg94JG6hIXGhaTK5skuU6TJJB79VWZxXSzFYGgEt9nC\n" +
  "UiY4iKTWO0Cmws0/zZiTs1QUWJZV1VD+hq2kY39ch/aO5ieSZxeSAgMs3NZmdO3d\n" +
  "Z//BYY1jTw+bbRcwJu+r0h8QoPnFfxZpgQNH7R5ojXKhTbImxrpsX23Wr9GxE46p\n" +
  "rfNeaXUmGD5BKyF/7otdBwadQ8QpCiv8Kj6GyzyDOvnJDdrFmeK8eEEzduG/L13l\n" +
  "pJhQDBXd4Pqcfzho0LKmeqfRMb1+ilgnQ7O6M5HTp5gVXJrm0w912fxBmJc+qiXb\n" +
  "j5IusHsMX/FjqTf5m3VpTCgmJdrV8hJwRVXj33NeN/UhbJCONVrJ0yPr08C+eKxC\n" +
  "KFhmpUZtcALXEPlLVPxdhkqHz3/KRawRWrUgUY0viEeXOcDPusBCAUCZSCELa6fS\n" +
  "/ZbV0b5GnUngC6agIk440ME8MLxwjyx1zNDFjFE7PZQIZCZhfbnDZY8UnCHQqv0X\n" +
  "cgOPvZuM5l5Tnrmd74K74bzickFbIZTTRTeU0d8JOV3nI6qaHcptqAqGhYqCvkIH\n" +
  "1vI4gnPah1vlPNOePqc7nvQDs/nxfRN0Av+7oeX6AHkcpmZBiFxgV6YuCcS6/ZrP\n" +
  "px9Aw7vMWgpVSzs4dlG4Y4uElBbmVvMCAwEAAaNCMEAwDwYDVR0TAQH/BAUwAwEB\n" +
  "/zAOBgNVHQ8BAf8EBAMCAQYwHQYDVR0OBBYEFP6rAJCYniT8qcwaivsnuL8wbqg7\n" +
  "MA0GCSqGSIb3DQEBCwUAA4ICAQDPdyxuVr5Os7aEAJSrR8kN0nbHhp8dB9O2tLsI\n" +
  "eK9p0gtJ3jPFrK3CiAJ9Brc1AsFgyb/E6JTe1NOpEyVa/m6irn0F3H3zbPB+po3u\n" +
  "2dfOWBfoqSmuc0iH55vKbimhZF8ZE/euBhD/UcabTVUlT5OZEAFTdfETzsemQUHS\n" +
  "v4ilf0X8rLiltTMMgsT7B/Zq5SWEXwbKwYY5EdtYzXc7LMJMD16a4/CrPmEbUCTC\n" +
  "wPTxGfARKbalGAKb12NMcIxHowNDXLldRqANb/9Zjr7dn3LDWyvfjFvO5QxGbJKy\n" +
  "CqNMVEIYFRIYvdr8unRu/8G2oGTYqV9Vrp9canaW2HNnh/tNf1zuacpzEPuKqf2e\n" +
  "vTY4SUmH9A4U8OmHuD+nT3pajnnUk+S7aFKErGzp85hwVXIy+TSrK0m1zSBi5Dp6\n" +
  "Z2Orltxtrpfs/J92VoguZs9btsmksNcFuuEnL5O7Jiqik7Ab846+HUCjuTaPPoIa\n" +
  "Gl6I6lD4WeKDRikL40Rc4ZW2aZCaFG+XroHPaO+Zmr615+F/+PoTRxZMzG0IQOeL\n" +
  "eG9QgkRQP2YGiqtDhFZKDyAthg710tvSeopLzaXoTvFeJiUBWSOgftL2fiFX1ye8\n" +
  "FVdMpEbB4IMeDExNH08GGeL5qPQ6gqGyeUN51q1veieQA6TqJIc/2b3Z6fJfUEkc\n" +
  "7uzXLg==\n" +
  "-----END CERTIFICATE-----\n"

const demoRootCA = "-----BEGIN CERTIFICATE-----\n" +
  "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\n" +
  "-----END CERTIFICATE-----"

import forge from 'node-forge'

import EphemeralConnector from '@discipl/core-ephemeral'
import { Octicons } from '@expo/vector-icons';
import {NavigationEvents} from 'react-navigation';

import * as Localization from 'expo-localization';
import i18n from 'i18n-js';
import * as en from '../lang/en.json';
import * as nl from '../lang/nl.json';

i18n.fallbacks = true;
i18n.translations = { nl, en };
i18n.locale = Localization.locale;

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

  constructor (props) {

    super(props)
    this.state = {
      hasCameraPermission: null,
    }
  }

  async componentDidMount() {
    const hasCameraPermission = this.state.hasCameraPermission
    const cameraPermissionStorage = await this._retrieveData()
    if (cameraPermissionStorage != "granted") {
      Alert.alert(
        i18n.t("permissionHeader"),
        i18n.t("permissionMessage"),
        [
          {text: 'OK', onPress: () => this.askPermissions()},
        ],
        { cancelable: false }
      )
    }
    else {
      this.askPermissions()
    }
    const { navigation } = this.props;
    navigation.addListener('willFocus', () =>
      this.setState({ focusedScreen: true })
    );
    navigation.addListener('willBlur', () =>
      this.setState({ focusedScreen: false })
    );
  }

  _retrieveData = async () => {
    try {
      const value = await AsyncStorage.getItem("cameraPermissions");
      if (value !== null) {
        // We have data!!
        return value;
      }
      else if (value == null) {
        console.log("value was null")
      }
    } catch (error) {
      console.log(error)
    }
  }

  _storeData = async (data) => {
    try {
      await AsyncStorage.setItem("cameraPermissions", data);
    } catch (error) {
      console.log(error.message)
    }
  }

  async askPermissions() {
    console.log("Entered askPermission function");
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });
    console.log("changed hasCameraPermission state");
    this._storeData("granted");
  }

  render() {
    const { hasCameraPermission, focusedScreen } = this.state;

    if (hasCameraPermission === null) {
      return <Text>Requesting for camera permission</Text>;
    }
    if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    }
    if (this.state.focusedScreen === false) {
      return <Text>Screen is currently not active</Text>
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

  async componentDidMount() {
    var strictValidation = await this._retrieveData()
    console.log('StrictValidation', strictValidation)
    this.rootCA = (strictValidation=="true") ? realRootCA : demoRootCA
    console.log('rootCA', this.rootCA);
  }

  static navigationOptions = {
    headerTitle: i18n.t("validatingHeader"),
  };

  _retrieveData = async () => {
    try {
      const value = await AsyncStorage.getItem("strictValidationSwitchValue");
      if (value !== null) {
        // We have data!!
        return value;
      }
      else if (value == null) {
        console.log("value was null")
      }
    } catch (error) {
      console.log(error)
    }
  }

  async renderClaimData(){
    if(this.state.validatingState == "verified"){
      let claimData = await this._readData();
      this.setState({claimData: claimData})
      let renderData = await this._renderData();
      this.setState({renderData: renderData})
    }
  }

  async _readData() {
    let displayData = await this.state.qrString;
    let documentJson = JSON.parse(displayData).claimData;
    let claimWithLink = Object.values(documentJson)[0][0];
    let claimData = Object.values(claimWithLink)[0];
    return claimData;
  }

  async _renderData() {
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
    this.paperWallet = new PaperWallet()
    console.log('Instantiated paper wallet', this.paperWallet)

    const { navigation } = this.props;
    const qrString = await navigation.getParam('qrString', 'String not found');

    try {
      let certEndpoint = JSON.parse(qrString).metadata.cert
      console.log('Fetching', certEndpoint)

      let certChain =  await fetch(certEndpoint)
        .then((response) => {
          return response.text()
        })
        .catch((e) => {
          console.log('Request failed', e)
          console.log(e.stack)
          console.log(e.message)
        })

      let certRegex = /-----BEGIN CERTIFICATE-----[\sa-zA-Z0-9/+\\=]*-----END CERTIFICATE-----/g

      let certChainArray = certChain.match(certRegex)
      let certChainParsed = certChainArray.map((cert) =>  forge.pki.certificateFromPem(cert))
      console.log('Fetched cert', certChain)

      console.log('Creating CA store')

      let orgCertifcate = certChainArray[0]

      let orgCertifcateParsed = certChainParsed[0]
      console.log('Parsing organization name')
      const organizationName = orgCertifcateParsed.subject.attributes.filter(attribute => attribute.name === 'organizationName')[0].value
      console.log('Parsed organization name', organizationName)



      const caStore = forge.pki.createCaStore([this.rootCA])
      console.log('Verifying against CA store')
      forge.pki.verifyCertificateChain(caStore, certChainParsed)
      console.log('Truely verified')

      this.setState({qrString: qrString, issuer: organizationName})



      console.log('Registering ephemeral connector', EphemeralConnector)
      this.paperWallet.getCore().registerConnector('ephemeral', new EphemeralConnector())
      console.log('Importing attestorSsid')
      console.log(orgCertifcate)
      let attestorSsid = await (await this.paperWallet.getCore().getConnector('ephemeral')).newIdentity({'cert': orgCertifcate})
      console.log("Validating...")
      this.result = await this.paperWallet.validate(attestorSsid.did, qrString)
      console.log(this.result)
    }
    catch (e) {
      this.result = false
      console.log("This was not a valid certificate", e);
      console.log(e.stack)
    }


  }

  async wrapperFunction() {
    await this._checkQR()
    console.log(this.result);
    if(this.result == null || this.result == false){
      this.setState({validatingState: "denied"})
    }
    else if(this.result == true){
      this.setState({validatingState: "verified"})
      this.renderClaimData()
    }
  };

  render() {
    const verified = <Octicons name="verified" size={64} color="#33ff33"/>;
    const denied = <Octicons name="alert" size={64} color="#FF0000" />;
    const waiting = <Octicons name="watch" size={64} color="#777777" />;

    let validatingIcon;
    let validatingText;
    let issuerText;
    if (this.state.validatingState == "waiting"){
      validatingIcon = waiting;
      validatingText = i18n.t("checkingQR");
    }
    if (this.state.validatingState == "verified"){
      validatingIcon = verified;
      validatingText = i18n.t("validQR");
      issuerText = i18n.t("issuerNameDescription") + this.state.issuer
    }
    if (this.state.validatingState == "denied"){
      validatingIcon = denied;
      validatingText = i18n.t("invalidQR");
    }
    return (
      <View style={styles.container}>
        <View style={styles.validateState}>
          <NavigationEvents onDidFocus={payload => this.wrapperFunction()}/>
          <Text style ={styles.key}>{validatingText}</Text>
          {validatingIcon}
          <Text style ={styles.value}>{issuerText}</Text>
        </View>

        <FlatList
          data={this.state.renderData}
          showsVerticalScrollIndicator={false}
          renderItem={({item}) =>
          <View key={item.key} style={styles.flatview}>
            <Text style={styles.key}>{item.key}</Text>
            <Text style={styles.value}>{item.props.value}</Text>
          </View>
          }
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
    padding: 10,
    margin: 10,
    flexDirection:'column',
    alignItems:'center',
    justifyContent:'center',
  },
  flatview: {
    backgroundColor: '#F6F6F6',
    borderTopWidth: 2,
    borderTopColor: '#DDDDDD'
  }
})
