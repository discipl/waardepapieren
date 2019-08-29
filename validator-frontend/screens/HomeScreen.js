import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Switch,
  AsyncStorage,
} from 'react-native';
import { WebBrowser } from 'expo';

import { MonoText } from '../components/StyledText';

import * as Localization from 'expo-localization';
import i18n from 'i18n-js';
import * as en from '../lang/en.json';
import * as nl from '../lang/nl.json';

i18n.fallbacks = true;
i18n.translations = { nl, en };
i18n.locale = Localization.locale;

export default class HomeScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      strictValidationSwitchValue: false,
    }
  }

  static navigationOptions = {
    header: null,
  };

  render() {
    return (
      <View style={styles.container}>
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
          <View style={styles.welcomeContainer}>
            <Image
              source={
                __DEV__
                  ? require('../assets/images/discipl.png')
                  : require('../assets/images/discipl.png')
              }
              style={styles.welcomeImage}
            />
          </View>

          <View style={styles.getStartedContainer}>
            {this._maybeRenderDevelopmentModeWarning()}

            <Text style={styles.getStartedText}>{i18n.t("welcomeMessage")}</Text>
          </View>
          <Text style={styles.developmentModeText}>{i18n.t("strictValidationMessage")}</Text>
          <Switch
            onValueChange={this.strictValidationSwitch}
            value={this.state.strictValidationSwitchValue}
          />
        </ScrollView>
      </View>
    );
  }

  strictValidationSwitch = (value) => {
      this.setState({strictValidationSwitchValue: value})
      console.log('The strict validation switch is: ' + value)
      this._storeData(value.toString())
  }

  _storeData = async (data) => {
    try {
      await AsyncStorage.setItem("strictValidationSwitchValue", data);
    } catch (error) {
      console.log(error.message)
    }
  }

  _maybeRenderDevelopmentModeWarning() {
    if (__DEV__) {
      const learnMoreButton = (
        <Text onPress={this._handleLearnMorePress} style={styles.helpLinkText}>
          Learn more
        </Text>
      );

      return (
        <Text style={styles.developmentModeText}>
          Development mode is enabled. {i18n.t("betaMessage")}
        </Text>
      );
    } else {
      return (
        <Text style={styles.developmentModeText}>
          {i18n.t("betaMessage")}
        </Text>
      );
    }
  }

  _handleLearnMorePress = () => {
    WebBrowser.openBrowserAsync('https://docs.expo.io/versions/latest/guides/development-mode');
  };

  _handleHelpPress = () => {
    WebBrowser.openBrowserAsync(
      'https://docs.expo.io/versions/latest/guides/up-and-running.html#can-t-see-your-changes'
    );
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  developmentModeText: {
    marginBottom: 20,
    color: 'rgba(0,0,0,0.4)',
    fontSize: 14,
    lineHeight: 19,
    textAlign: 'center',
  },
  contentContainer: {
    paddingTop: 30,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  },
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightText: {
    color: 'rgba(96,100,109, 0.8)',
  },
  codeHighlightContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center',
  },
  tabBarInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
    alignItems: 'center',
    backgroundColor: '#fbfbfb',
    paddingVertical: 20,
  },
  tabBarInfoText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center',
  },
  navigationFilename: {
    marginTop: 5,
  },
  helpContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
    textAlign: 'center',
  },
  helpLinkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
  switch: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100
  }
});
