import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import NetInfo from '@react-native-community/netinfo'; // For checking internet connectivity
import Toast from 'react-native-toast-message'; // Toast for showing alerts

const SplashScreen = () => {
  const [isConnected, setIsConnected] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    checkInternetConnectivity();
  }, []);

  // Check internet connectivity
  const checkInternetConnectivity = () => {
    NetInfo.fetch().then(state => {
      if (!state.isConnected) {
        setIsConnected(false);
        Toast.show({
          type: 'error',
          position: 'bottom',
          text1: 'No internet connection',
          visibilityTime: 2000,
        });
      } else {
        setIsConnected(true);
        console.log('Internet is connected');
      }

      // Navigate to the MainView after a small delay
      setTimeout(() => {
        navigation.replace('MainApp'); // Replace SplashScreen with MainView
      }, 3000); // 3 seconds delay
    });
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/images/splash_logo.png')} // Make sure you have a splash logo in your assets
        style={styles.logo}
      />
      
      {/* Show a loading spinner while checking connectivity */}
      <ActivityIndicator size="large" color="#fff" />

      {/* Show a toast notification if no internet */}
      {!isConnected && (
        <Toast />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#00011f',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 500,
    height: 300,
    resizeMode: 'contain',
    marginBottom: 20,
  },
});

export default SplashScreen;
