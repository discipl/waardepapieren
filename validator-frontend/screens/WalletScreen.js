import React, { Component } from 'react';
import { AppRegistry, FlatList, StyleSheet, TouchableWithoutFeedback, Text, View } from 'react-native';
import { createStackNavigator } from 'react-navigation'
import { AsyncStorage } from 'react-native'
import { Octicons } from '@expo/vector-icons';
import * as paperWallet from '@discipl/paper-wallet'
import EphemeralConnector from '@discipl/core-ephemeral'
import Asset from 'expo'

export default class App extends React.Component {
  render() {
    return <WalletStack />;
  }
}

class WalletScreen extends React.Component {
  static navigationOptions = {
    headerTitle: 'wallet screen',
  };
  render() {
    return (
      <View style={styles.container}>
        <FlatList
          data={[
            {key: 'Uitreksel BRP'},
            {key: 'Huisregistratie'},
          ]}
          renderItem={({item}) => (
            <TouchableWithoutFeedback onPress={ () => this.props.navigation.navigate('Uitreksel')}>

              <View>
                <Text style={styles.item}>{item.key}</Text>
              </View>

            </TouchableWithoutFeedback>
          )}
        />
      </View>
    );
  }
}

class UitrekselScreen extends Component {
  static navigationOptions = {
    headerTitle: 'Uitreksel screen',
  };

  constructor(props){
    super(props)
    this.state = {}
  }

  async componentDidMount() {
    let displayData = await this._readData();
    this.setState({displayData: displayData})
  };

  _retrieveData = async () => {
    try {
      const value = await AsyncStorage.getItem("BRP1");
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

  _readData = async () => {
    let displayData = await this._retrieveData();
    let documentJson = JSON.parse(displayData);
    let claimWithLink = Object.values(documentJson)[0][0];
    let claimData = Object.values(claimWithLink)[0];
    let tempdata = claimData[0];
    let moredata = Object.values(tempdata)[0];
    return moredata;
  }

  render() {
    const displayData = this.state.displayData;
    return (
      <View style={styles.container}>
        <FlatList
          data={[
            {key: 'Uit memory'},
            {key: 'nog niet'},
          ]}
          renderItem={({item}) => (
            <TouchableWithoutFeedback onPress={ () => this._retrieveData()}>

              <View>
                <Text style={styles.item}>{displayData}</Text>
              </View>

            </TouchableWithoutFeedback>
          )}
        />
      </View>
    );
  }
}

const WalletStack = createStackNavigator({
  Wallet: WalletScreen,
  Uitreksel: UitrekselScreen
});

const styles = StyleSheet.create({
  container: {
   backgroundColor: 'white',
   flex: 1,
   paddingTop: 22
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
})
