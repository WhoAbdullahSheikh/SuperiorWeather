import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeScreen from './screens/HomeScreen';
import ForecastScreen from './screens/ForecastScreen';
import RadarScreen from './screens/RadarScreen';
import LiveScreen from './screens/LiveScreen';
import Ionicons from 'react-native-vector-icons/Ionicons'; // Import Ionicons

const Tab = createBottomTabNavigator();

const MainApp = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#42f44b', // Customize the active tab color
      }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({color, size}) => (
            <Ionicons name="home" size={size} color={color} /> // Home icon
          ),
        }}
      />
      <Tab.Screen
        name="Forecast"
        component={ForecastScreen}
        options={{
          tabBarIcon: ({color, size}) => (
            <Ionicons name="cloud-outline" size={size} color={color} /> // Forecast icon
          ),
        }}
      />
      <Tab.Screen
        name="Radar"
        component={RadarScreen}
        options={{
          tabBarIcon: ({color, size}) => (
            <Ionicons name="radio-outline" size={size} color={color} /> // Radar icon
          ),
        }}
      />
      <Tab.Screen
        name="Live"
        component={LiveScreen}
        options={{
          tabBarIcon: ({color, size}) => (
            <Ionicons name="logo-octocat" size={size} color={color} /> // Live icon
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default MainApp;
