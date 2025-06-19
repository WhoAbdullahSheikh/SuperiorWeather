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
      <View style={styles.logoAndSocialContainer}>
        {}
        <View style={styles.logoContainer}>
    <TouchableOpacity 
            onPress={() => handlePress('https://Superiorweather.com')}
        activeOpacity={0.7}
      >
        <Image
          source={require('../../assets/images/splash_logo.png')}
          style={styles.logo}
        />
      </TouchableOpacity>
        </View>
      
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
    </View>
  );
};

const styles = StyleSheet.create({
  socialMediaContainer: {
    marginVertical: 12,
    paddingHorizontal: 10,
  },
  logoAndSocialContainer: {
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: 20,
  },
  logo: {
    width: 500,
    height: 200,
    resizeMode: 'contain',
    right: 110,
    marginBottom: -80,
    marginTop: -100,
  },
  socialIconsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  followText: {
    fontSize: 22,
    fontWeight: 'bold',
    marginRight: 10,
    color: 'white',
    fontFamily: 'Raleway-Regular',
  },
  socialIcon: {
    marginHorizontal: 8,
  },
  divider: {
    width: '100%',
    borderBottomWidth: 2,
    borderBottomColor: '#fff',
    marginBottom: 15,
  },
  divider2: {
    width: '100%',
    borderBottomWidth: 2,
    borderBottomColor: '#fff',
    marginTop: 15,
  },
});

export default SocialMediaSection;