import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

const AlertsScreen = () => {
  return (
    <View style={styles.container}>
      <WebView 
        source={{ uri: 'https://www.pivotalweather.com/maps.php?data_type=forecasts&r=us_ne&p=nwshaz&ds=hazards' }} 
        style={{ flex: 1 }} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    backgroundColor: '#282828',
  },
});

export default AlertsScreen;
