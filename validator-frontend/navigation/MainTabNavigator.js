import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { AntDesign, MaterialIcons } from '@expo/vector-icons'
import HomeScreen from '../screens/HomeScreen'
import ScanScreen from '../screens/ScanScreen'

import * as Localization from 'expo-localization'
import i18n from 'i18n-js'
import * as en from '../lang/en.json'
import * as nl from '../lang/nl.json'

i18n.fallbacks = true;
i18n.translations = { nl, en };
i18n.locale = Localization.locale;

const HomeStack = createNativeStackNavigator();

function MyHomeStack() {
  return (
    <HomeStack.Navigator>
        <HomeStack.Screen
            name="HomeStack"
            component={HomeScreen}
            options={{ headerShown: false }}
        />
    </HomeStack.Navigator>
  );
}

const ScanStack = createNativeStackNavigator();

function MyScanStack() {
  return (
    <ScanStack.Navigator>
        <ScanStack.Screen
            name="ScanStack"
            component={ScanScreen}
            options={{ headerShown: false }}
        />
    </ScanStack.Navigator>
  );
}

const Tab = createBottomTabNavigator();

export default function MainTabNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={MyHomeStack} options={{
          tabBarLabel: i18n.t("navigationHome"),
          tabBarIcon: ({ focused }) => (
              <AntDesign name="home" size={24} color="blue"/>
          ),
          headerShown:false
      }}/>
      <Tab.Screen name="Scan" component={MyScanStack} options={{
          tabBarLabel: i18n.t("navigationScan"),
          tabBarIcon: ({ focused }) => (
              <MaterialIcons name="qr-code-scanner" size={24} color="blue"/>
          ),
          headerShown:false
      }} />
    </Tab.Navigator>
  );
}
