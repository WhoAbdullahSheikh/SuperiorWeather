import React, { useRef, useState, useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity, Animated, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { WebView } from 'react-native-webview';
import { useFocusEffect } from '@react-navigation/native';

const WEATHER_URL = 'https://v2.weatherscan.net';

const ForecastScreen = () => {
  const webViewRef = useRef(null);
  const [isMuted, setIsMuted] = useState(false);
  const [webViewSource, setWebViewSource] = useState({ uri: WEATHER_URL });
  const fabAnim = useRef(new Animated.Value(0)).current;

  // Animate FABs in
  React.useEffect(() => {
    Animated.timing(fabAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [fabAnim]);

  // Handle navigation focus/blur for WebView
  useFocusEffect(
    useCallback(() => {
      setWebViewSource({ uri: WEATHER_URL });
      // No cleanup needed, let WebView unmount naturally
    }, [])
  );

  // Reload WebView
  const handleReload = () => {
    if (webViewRef.current) {
      webViewRef.current.reload();
      // Re-apply mute state after reload
      setTimeout(() => {
        if (isMuted) handleMute(true);
      }, 500);
    }
  };

  // Mute/unmute all audio/video in WebView
  const handleMute = (forceMute) => {
    const newMuted = typeof forceMute === 'boolean' ? forceMute : !isMuted;
    setIsMuted(newMuted);
    const muteScript = `
      (function() {
        var videos = document.getElementsByTagName('video');
        for (var i = 0; i < videos.length; i++) {
          videos[i].muted = ${newMuted};
        }
        var audios = document.getElementsByTagName('audio');
        for (var i = 0; i < audios.length; i++) {
          audios[i].muted = ${newMuted};
        }
        true;
      })();
    `;
    webViewRef.current?.injectJavaScript(muteScript);
  };

  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        source={webViewSource}
        style={{ flex: 1 }}
        scrollEnabled={false}
        scalesPageToFit={false}
        injectedJavaScript={`
          var meta = document.createElement('meta');
          meta.setAttribute('name', 'viewport');
          meta.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no');
          document.getElementsByTagName('head')[0].appendChild(meta);
          true;
        `}
        allowsInlineMediaPlayback={true}
        mediaPlaybackRequiresUserAction={false}
      />
      <Animated.View
        style={[
          styles.fabContainer,
          { opacity: fabAnim, transform: [{ translateY: fabAnim.interpolate({ inputRange: [0, 1], outputRange: [40, 0] }) }] },
        ]}
      >
        <TouchableOpacity
          style={styles.fabButton}
          onPress={handleReload}
          accessibilityLabel="Reload Website"
        >
          <Icon name="refresh" size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.fabButton}
          onPress={() => handleMute()}
          accessibilityLabel={isMuted ? 'Unmute Website' : 'Mute Website'}
        >
          <Icon name={isMuted ? 'volume-off' : 'volume-up'} size={24} color="#fff" />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 50 : 0,
    backgroundColor: '#282828',
  },
  fabContainer: {
    position: 'absolute',
    flexDirection: 'row',
    right: 20,
    top: 60,
    zIndex: 10,
  },
  fabButton: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 12,
    borderRadius: 50,
    marginLeft: 10,
    elevation: 4,
  },
});

export default ForecastScreen;
