import React from 'react'
import { createBottomTabNavigator, createStackNavigator } from 'react-navigation'
import { AntDesign, Ionicons } from '@expo/vector-icons'
import HomeScreen from '../screens/HomeScreen'
import ScanScreen from '../screens/ScanScreen'

import * as Localization from 'expo-localization';
import i18n from 'i18n-js';
import * as en from '../lang/en.json';
import * as nl from '../lang/nl.json';

i18n.fallbacks = true;
i18n.translations = { nl, en };
i18n.locale = Localization.locale;

const HomeStack = createStackNavigator({
  Home: HomeScreen,
})

HomeStack.navigationOptions = {
  tabBarLabel: i18n.t("navigationHome"),
  tabBarIcon: ({ focused }) => (
    <AntDesign name="home" size={24} color="blue"/>
  ),
}

const ScanStack = createStackNavigator({
  Scan: ScanScreen,
})

ScanStack.navigationOptions = {
  tabBarLabel: i18n.t("navigationScan"),
  tabBarIcon: ({ focused }) => (
    <Ionicons name="md-qr-scanner" size={24} color="blue"/>
  ),
}

export default createBottomTabNavigator({
  HomeStack,
  ScanStack
})
