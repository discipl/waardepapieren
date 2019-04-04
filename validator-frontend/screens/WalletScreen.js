import React, { Component } from 'react';
import { AppRegistry, FlatList, StyleSheet, TouchableWithoutFeedback, Text, View } from 'react-native';
import { createStackNavigator } from 'react-navigation'
import { AsyncStorage } from 'react-native'
import { Octicons } from '@expo/vector-icons';

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
                <Octicons name="verified" size={48} color="#33ff33" />
                <Octicons name="alert" size={48} color="#FF0000" />
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
  _retrieveData = async () => {
    try {
      const value = await AsyncStorage.getItem("Test");
      if (value !== null) {
        // We have data!!
        console.log(value);
      }
      else if (value == null) {
        console.log("value was null")
      }
    } catch (error) {
      console.log(error)
    }
  }

  render() {
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
                <Text style={styles.item}>{item.key}</Text>
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
