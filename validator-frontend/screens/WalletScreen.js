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
      const value = await AsyncStorage.getItem("BRP1");
      if (value !== null) {
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
        // We have data!!
        console.log(value);
        paperWallet.getCore().registerConnector('ephemeral', new EphemeralConnector())
        let attestorSsid = await (await paperWallet.getCore().getConnector('ephemeral')).newIdentity({'cert': cert})
        let validatorSsid = await paperWallet.getCore().newSsid('ephemeral')
        console.log("I was Here")
        let result = await paperWallet.validate(attestorSsid.did, value, validatorSsid.did)
        console.log(result)
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
