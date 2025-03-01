import React from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

const ForecastScreen = () => {
  return (
    <View style={styles.container}>
      <WebView 
        source={{ uri: 'https://battaglia.ddns.net/twc/' }} 
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

export default ForecastScreen;
