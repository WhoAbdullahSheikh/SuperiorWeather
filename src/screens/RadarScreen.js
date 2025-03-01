import React from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

const RadarScreen = () => {
  return (
    <View style={styles.container}>
      <WebView 
        source={{ uri: 'https://www.weatherandradar.com/weather-map/new-york/6112695?center=41.34,-74.32&placemark=40.7143,-74.006&zoom=7&layer=wr' }} 
        style={{ flex: 1 }} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 55,
    backgroundColor: '#282828',
  },
});

export default RadarScreen;
