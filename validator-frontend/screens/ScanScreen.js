import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { BarCodeScanner, Permissions } from 'expo';
import { createStackNavigator } from 'react-navigation'
import { AsyncStorage } from 'react-native'

export default class App extends React.Component {
  render() {
    return <ScanStack />;
  }
}

class ScanScreen extends React.Component {
  state = {
    hasCameraPermission: null,
  }

  async componentDidMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });
    }

  _storeData = async (data) => {
    try {
      await AsyncStorage.setItem("BRP1", data);
    } catch (error) {
      console.log(error.message)
    }
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
    console.log(data)
    this._storeData(data);
    alert(`Bar code with type ${type} and data ${data} has been scanned!`);
    this.props.navigation.navigate('Validating', {qrString: data})
  }
}

class ValidatingScreen extends Component {
  static navigationOptions = {
    headerTitle: 'Validating screen',
  };
  render() {
    const { navigation } = this.props;
    const qrString = navigation.getParam('qrString', 'String not found');
    console.log(qrString);
    return (
      <View>
        <Text>QR: {JSON.stringify(qrString)}</Text>
      </View>
    );
  }
}

const ScanStack = createStackNavigator({
  Scan: ScanScreen,
  Validating: ValidatingScreen
});
