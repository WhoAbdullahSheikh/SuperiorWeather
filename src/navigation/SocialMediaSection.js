import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Linking,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon3 from 'react-native-vector-icons/Ionicons';

const SocialMediaSection = () => {
  const handlePress = url => {
    if (!url.startsWith('https://')) {
      url = 'https://' + url;
    }
    Linking.openURL(url).catch(err => console.error('An error occurred', err));
  };

  return (
    <View style={styles.socialMediaContainer}>
      {/* Make the logo container clickable */}
      <TouchableOpacity 
        style={styles.logoContainer}
        onPress={() => handlePress('https://Superiorweather.com')} // Replace with your desired URL
        activeOpacity={0.7}
      >
        <Image
          source={require('../../assets/images/splash_logo.png')}
          style={styles.logo}
        />
      </TouchableOpacity>
      
      <View style={styles.divider}></View>

      <View style={styles.socialIconsContainer}>
        <Text style={styles.followText}>Follow Us</Text>
        <TouchableOpacity
          style={styles.socialIcon}
          onPress={() =>
            handlePress(
              'https://facebook.com/profile.php?id=100088230610721&mibextid=LQQJ4d',
            )
          }>
          <Icon3 name="logo-facebook" size={22} color="#3b5998" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.socialIcon}
          onPress={() => handlePress('https://youtube.com/@superiorweather')}>
          <Icon3 name="logo-youtube" size={22} color="#FF0000" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.socialIcon}
          onPress={() =>
            handlePress('https://www.instagram.com/superiorweather')
          }>
          <Icon name="instagram" size={22} color="#E4405F" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.socialIcon}
          onPress={() =>
            handlePress('https://www.tiktok.com/@superiorweather?lang=en')
          }>
          <Icon3 name="logo-tiktok" size={22} color="#ebc9ff" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.socialIcon}
          onPress={() => handlePress('https://twitch.tv/superiorweather')}>
          <Icon2 name="twitch" size={24} color="#9146FF" />
        </TouchableOpacity>
      </View>
      <View style={styles.divider2}></View>
    </View>
  );
};

const styles = StyleSheet.create({
  logoContainer: {
    position: 'absolute',
    top: -176,
    left: -76,
    zIndex: 10,
    // Remove pointerEvents: 'none' since we want it to be clickable
  },
  logo: {
    width: 360,
    height: 360,
    resizeMode: 'contain',
  },
  socialMediaContainer: {
    marginVertical: 12,
    paddingHorizontal: 10,
  },
  socialIconsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  followText: {
    fontSize: 22,
    fontWeight: 'bold',
    marginRight: 10,
    color: 'white',
    fontFamily: 'Raleway-Regular',
  },
  iconsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  socialIcon: {
    marginHorizontal: 8,
  },
  divider: {
    marginTop: 40,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#fff',
    marginBottom: 0,
    justifyContent: 'center',
    position: 'relative',
  },
  divider2: {
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
});

export default SocialMediaSection;