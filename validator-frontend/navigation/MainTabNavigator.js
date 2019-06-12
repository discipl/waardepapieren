import React from 'react'
import { createBottomTabNavigator, createStackNavigator } from 'react-navigation'
import { AntDesign, Ionicons } from '@expo/vector-icons'
import HomeScreen from '../screens/HomeScreen'
import ScanScreen from '../screens/ScanScreen'

const HomeStack = createStackNavigator({
  Home: HomeScreen,
})

HomeStack.navigationOptions = {
  tabBarLabel: 'Home',
  tabBarIcon: ({ focused }) => (
    <AntDesign name="home" size={24} color="blue"/>
  ),
}

const ScanStack = createStackNavigator({
  Scan: ScanScreen,
})

ScanStack.navigationOptions = {
  tabBarLabel: 'Scan',
  tabBarIcon: ({ focused }) => (
    <Ionicons name="md-qr-scanner" size={24} color="blue"/>
  ),
}

export default createBottomTabNavigator({
  HomeStack,
  ScanStack
})
