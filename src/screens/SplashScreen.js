import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import NetInfo from '@react-native-community/netinfo';
import Toast from 'react-native-toast-message';

const SplashScreen = () => {
  const [isConnected, setIsConnected] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    checkInternetConnectivity();
  }, [checkInternetConnectivity]);

  const checkInternetConnectivity = useCallback(() => {
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

      setTimeout(() => {
        navigation.replace('MainApp');
      }, 2000);
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/images/splash_logo.png')}
        style={styles.logo}
      />
      
      {}
      <ActivityIndicator size="large" color="#fff" />

      {}
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
