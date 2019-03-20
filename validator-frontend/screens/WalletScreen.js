import React, { Component } from 'react';
import { AppRegistry, FlatList, StyleSheet, TouchableWithoutFeedback, Text, View } from 'react-native';
import { createStackNavigator } from 'react-navigation'

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
  render() {
    return (
      <View style={styles.container}>
        <FlatList
          data={[
            {key: 'Een andere'},
            {key: 'Lijst met dingen'},
          ]}
          renderItem={({item}) => (
            <TouchableWithoutFeedback onPress={ () => this.actionOnRow(item)}>

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
