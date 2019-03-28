import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { BarCodeScanner, Permissions } from 'expo';
import pako from 'pako'
import { AsyncStorage } from 'react-native'


export default class ScanScreen extends React.Component {
  state = {
    hasCameraPermission: null,
  }

  async componentDidMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });
    }

  _storeData = async (data) => {
    try {
      await AsyncStorage.setItem("Test", data);
      console.log("ive been here")
    } catch (error) {
      console.log(error)
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
    uncompressedData = pako.inflate(data, { 'to': 'string' })
    console.log(uncompressedData)
    this._storeData(uncompressedData);
    alert(`Bar code with type ${type} and data ${uncompressedData} has been scanned!`);

  }
}
