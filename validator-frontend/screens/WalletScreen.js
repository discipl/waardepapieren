import React, { Component } from 'react';
import { AppRegistry, FlatList, StyleSheet, TouchableWithoutFeedback, Text, View } from 'react-native';
import { createStackNavigator } from 'react-navigation'
import { AsyncStorage } from 'react-native'
import { Octicons } from '@expo/vector-icons';
import * as paperWallet from '@discipl/paper-wallet'
import EphemeralConnector from '@discipl/core-ephemeral'
import Asset from 'expo'

export default class App extends React.Component {
  static navigationOptions = {
    header: null,
  }
  render() {
    return <WalletStack />;
  }
}

class WalletScreen extends React.Component {
  static navigationOptions = {
    headerTitle: 'Gescande uittreksels',
  };
  render() {
    return (
      <View style={styles.container}>
        <FlatList
          data={[
            {key: 'Uitreksel BRP'},
          ]}
          renderItem={({item}) => (
            <TouchableWithoutFeedback onPress={ () => this.props.navigation.navigate('Uitreksel')}>

              <View>
                <Text style={styles.key}>{item.key}</Text>
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
    headerTitle: 'Uitreksel',
  };

  constructor(props){
    super(props)
    this.state = {}
  }

  async componentDidMount() {
    let claimData = await this._readData();
    this.setState({claimData: claimData})
    let renderData = await this._renderData();
    this.setState({renderData: renderData})
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

  render() {
    //const displayData = this.state.renderData;
    //console.log(displayData);
    return (
      <View style={styles.container}>
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

const WalletStack = createStackNavigator({
  Wallet: WalletScreen,
  Uitreksel: UitrekselScreen
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
  }
})
