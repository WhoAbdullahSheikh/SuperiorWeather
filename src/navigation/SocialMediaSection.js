
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon3 from 'react-native-vector-icons/Ionicons';

const SocialMediaSection = () => {
  return (
    <View style={styles.socialMediaContainer}>
      <View style={styles.divider}></View>
      <View style={styles.socialIconsContainer}>
        <TouchableOpacity style={styles.socialIcon}>
          <Icon3 name="logo-facebook" size={30} color="#3b5998" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialIcon}>
          <Icon3 name="logo-youtube" size={30} color="#FF0000" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialIcon}>
          <Icon name="instagram" size={30} color="#E4405F" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialIcon}>
          <Icon3 name="logo-tiktok" size={30} color="#ebc9ff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialIcon}>
          <Icon2 name="twitch" size={32} color="#9146FF" />
        </TouchableOpacity>
      </View>
      <View style={styles.divider}>

      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  socialMediaContainer: {
    marginVertical: 18,
    paddingHorizontal: 16,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#fff',
    marginBottom: 0,
    justifyContent: 'center',
    position: 'relative',
  },
  dividerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    paddingHorizontal: 10,
    position: 'absolute',
    top: -12,
  },
  socialIconsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  socialIcon: {
    padding: 10,
  },
});

export default SocialMediaSection;
