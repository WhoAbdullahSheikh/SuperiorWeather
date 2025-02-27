import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeScreen from './screens/HomeScreen';
import ForecastScreen from './screens/ForecastScreen';
import RadarScreen from './screens/RadarScreen';
import AlertsScreen from './screens/AlertsScreen';
import LiveScreen from './screens/LiveScreen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const Tab = createBottomTabNavigator();

const MainApp = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: 'white',  // Active icon color
        tabBarInactiveTintColor: 'grey', // Inactive icon color
        tabBarStyle: {
          backgroundColor: '#282828',  // Background color of the tab bar
        },
      }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({color, size}) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Forecast"
        component={ForecastScreen}
        options={{
          tabBarIcon: ({color, size}) => (
            <Ionicons name="cloud" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Radar"
        component={RadarScreen}
        options={{
          tabBarIcon: ({color, size}) => (
            <Ionicons name="radio" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Alerts"
        component={AlertsScreen}
        options={{
          tabBarIcon: ({color, size}) => (
            <FontAwesome name="bell" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Live"
        component={LiveScreen}
        options={{
          tabBarIcon: ({color, size}) => (
            <MaterialIcons name="live-tv" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default MainApp;
