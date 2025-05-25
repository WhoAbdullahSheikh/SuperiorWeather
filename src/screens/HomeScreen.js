import React, {useEffect, useState, useCallback, useRef} from 'react';
import {
  View,
  Text,
  Alert,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
  Image,
  Linking,
} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import axios from 'axios';
import moment from 'moment';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon2 from 'react-native-vector-icons/Feather';
import Video from 'react-native-video';
import SocialMediaSection from '../navigation/SocialMediaSection';
import WebView from 'react-native-webview';
import {RefreshControl} from 'react-native';
import RNRestart from 'react-native-restart';
import {
  scheduleWeatherNotification,
  configurePushNotifications,
} from '../services/NotificationService';
import {triggerWeatherAlerts} from '../services/NotificationService';
import BackgroundTimer from 'react-native-background-timer';

const HomeScreen = () => {
  const [location, setLocation] = useState(null);
  const [weather, setWeather] = useState(null);
  const [city, setCity] = useState('');
  const [countryName, setCountryName] = useState('');
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [textColor, setTextColor] = useState('#fff');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const onBuffer = buffer => {
    console.log('Buffering...', buffer);
  };

  const onError = error => {
    console.error('Video Error:', error);
  };
  const onRefresh = async () => {
    setIsRefreshing(true);
    if (location) {
      await getWeatherData(location.latitude, location.longitude);
    }
    setIsRefreshing(false);
  };

  useEffect(() => {
    configurePushNotifications();
    Geolocation.getCurrentPosition(
      async position => {
        const {latitude, longitude} = position.coords;
        const roundedLatitude = latitude.toFixed(6);
        const roundedLongitude = longitude.toFixed(6);

        setLocation({latitude: roundedLatitude, longitude: roundedLongitude});
        await getWeatherData(roundedLatitude, roundedLongitude);
        await reverseGeocode(roundedLatitude, roundedLongitude);
      },
      error => {
        console.log(error);
        setLoading(false);
      },
      {enableHighAccuracy: true, timeout: 2000},
    );
    _setBackgroundImage();
  }, [getWeatherData]);

  const scheduleDailyTask = useCallback(() => {
    console.log('Scheduling daily task...');
    BackgroundTimer.stopBackgroundTimer();

    BackgroundTimer.runBackgroundTimer(() => {
      console.log('Running background task...');
      if (location) {
        getWeatherData(location.latitude, location.longitude);
      }
    }, 24 * 60 * 60 * 1000);
  }, [location, getWeatherData]);

  useEffect(() => {
    if (location) {
      scheduleDailyTask();
    }

    return () => {
      BackgroundTimer.stopBackgroundTimer();
    };
  }, [location, scheduleDailyTask]);

  const reverseGeocode = async (lat, lng) => {
    try {
      const response = await axios.get(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`,
      );

      if (response.data && response.data.city) {
        setCity(response.data.city);
      }
      if (response.data && response.data.countryName) {
        setCountryName(response.data.countryName);
      }
    } catch (error) {
      console.error('Reverse geocode error:', error);
    }
  };

  const _setBackgroundImage = () => {
    const currentHour = new Date().getHours();

    if (currentHour >= 5 && currentHour < 18) {
      setBackgroundImage(require('../../assets/images/day.jpg'));
      setTextColor('#fff');
    } else {
      setBackgroundImage(require('../../assets/images/night.jpg'));
      setTextColor('#fff');
    }
  };

  const getWeatherData = useCallback(
    async (latitude, longitude) => {
      try {
        const API_KEY = '2B5JCJ8FL7P2SFDWTPQCVC7KU';
        const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${latitude},${longitude}?key=${API_KEY}`;

        const response = await axios.get(url);
        if (response.data && response.data.currentConditions) {
          setWeather(response.data);
          setLoading(false);

          const weatherInfo = {
            temperature: response.data.currentConditions.temp,
            feelsLike: response.data.currentConditions.feelslike,
            conditions: response.data.currentConditions.conditions,
            precipProbability: response.data.currentConditions.precipprob,
            windSpeed: response.data.currentConditions.windspeed,
            humidity: response.data.currentConditions.humidity,
            visibility: response.data.currentConditions.visibility,
            uvIndex: response.data.currentConditions.uvindex,
          };

          triggerWeatherAlerts(weatherInfo);
        } else {
          console.log('Error: Data structure is not as expected.');
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching weather data: ', error);
        setLoading(false);
      }
    },
    [],
  );

  const toggleExpand = () => {
    setExpanded(prevState => !prevState);
  };

  const openSettingsWithInstructions = () => {
    Linking.openSettings().catch(() => console.log('Cannot open settings'));
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4A90E2" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (weather && weather.currentConditions) {
    return (
      <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
        <ScrollView
          style={styles.container}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
          }>
          <SocialMediaSection />
          <View style={styles.currentWeatherContainer}>
            <Text style={[styles.cityText, {color: textColor}]}>
              <View style={styles.cityContainer}>
                {city ? (
                  <Text style={[styles.cityText, {color: textColor}]}>
                    {city}
                  </Text>
                ) : (
                  <ActivityIndicator size="small" color={textColor} />
                )}
              </View>
            </Text>
            <Text style={styles.temperatureText}>
              {Math.round(weather.currentConditions.temp)}°F
            </Text>
            <Icon
              name={getWeatherIcon(weather.currentConditions.conditions)}
              size={100}
              color="#fff"
              style={styles.weatherIcon}
            />
            <Text style={styles.conditionText}>
              {weather.currentConditions.conditions}
            </Text>
            <Text style={styles.feelsLikeText}>
              Feels like: {weather.currentConditions.feelslike}°F
            </Text>
          </View>
          <View style={styles.currentWeatherCard}>
            <Text style={styles.cardContent}>Lat: {location.latitude}</Text>
            <Text style={styles.cardContent}>Long: {location.longitude}</Text>
            <Text style={styles.countryContent}>
              Country: {countryName || 'Loading...'}
            </Text>
            <Text style={styles.cardContent}>
              Weather: {weather.currentConditions.conditions}
            </Text>
            <Text style={styles.cardContent}>
              Temperature: {weather.currentConditions.temp}°F
            </Text>
          </View>
          <Text style={styles.sectionTitle}>Hourly Forecast</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {weather.days[0].hours.slice(0, 24).map((hour, index) => {
              const formattedTime = hour.datetime
                ? moment(hour.datetime, 'HH:mm:ss').format('h : 00 A')
                : 'Invalid time';

              return (
                <View key={index} style={styles.hourlyCard}>
                  <Text style={styles.hourlyTime}>{formattedTime}</Text>
                  <Icon
                    name={getWeatherIcon(hour.conditions)}
                    size={40}
                    color="white"
                    style={styles.hourlyIcon}
                  />
                  <Text style={styles.hourlyTemp}>
                    {Math.round(hour.temp)}°F
                  </Text>
                  <Text style={styles.hourlyCondition}>{hour.conditions}</Text>
                </View>
              );
            })}
          </ScrollView>

          <TouchableOpacity style={styles.toggleButton} onPress={toggleExpand}>
            <Text style={styles.toggleButtonText}>
              {expanded ? '5-Day Forecast' : '5-Day Forecast'}
            </Text>
            <Icon2
              name={expanded ? 'chevron-up' : 'chevron-down'}
              size={24}
              color="#fff"
              style={styles.toggleIcon}
            />
          </TouchableOpacity>

          {expanded && (
            <View>
              <Text style={styles.sectionTitle}>5-Day Forecast</Text>
              {weather.days.slice(0, 5).map((day, index) => (
                <View key={index} style={styles.forecastCard}>
                  <Text style={styles.forecastDate}>
                    {moment(day.datetime).format('dddd, MMM Do')}
                  </Text>
                  <View style={styles.forecastDetails}>
                    <Icon
                      name={getWeatherIcon(day.conditions)}
                      size={50}
                      color="white"
                      style={styles.forecastIcon}
                    />
                    <Text style={styles.forecastTemp}>
                      Day: {Math.round(day.tempmax)}°F | Night:{' '}
                      {Math.round(day.tempmin)}°F
                    </Text>
                  </View>
                  <Text style={styles.forecastCondition}>{day.conditions}</Text>

                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {weather.days[0].hours.slice(0, 24).map((hour, index) => {
                      const formattedTime = hour.datetime
                        ? moment(hour.datetime, 'HH:mm:ss').format('h : 00 A')
                        : 'Invalid time';

                      return (
                        <View key={index} style={styles.hourlyCard}>
                          <Text style={styles.hourlyTime}>{formattedTime}</Text>
                          <Icon
                            name={getWeatherIcon(hour.conditions)}
                            size={40}
                            color="white"
                            style={styles.hourlyIcon}
                          />
                          <Text style={styles.hourlyTemp}>
                            {Math.round(hour.temp)}°F
                          </Text>
                          <Text style={styles.hourlyCondition}>
                            {hour.conditions}
                          </Text>
                        </View>
                      );
                    })}
                  </ScrollView>
                </View>
              ))}
            </View>
          )}

          <TouchableOpacity
            onPress={() =>
              Linking.openURL(
                'mailto:superiorweather@gmail.com?subject=Proposal for advertisement&body=Hello Superior Weather Team,',
              )
            }
            style={styles.videoContainer}>
            <Video
              source={require('../../assets/banner_video.mp4')}
              onBuffer={onBuffer}
              onError={onError}
              style={styles.video}
              controls={true}
              repeat={true}
              resizeMode="cover"
              autoPlay={true}
            />
          </TouchableOpacity>
          <View style={styles.webViewContainer}>
            <WebView
              source={{
                uri: 'https://player.twitch.tv/?channel=superiorweather&parent=com.example.superior_weather',
              }}
              style={styles.webView}
              javaScriptEnabled={true}
              domStorageEnabled={true}
            />
          </View>
          <View style={styles.videoContainer}>
            <Image
              source={require('../../assets/web_banner8.gif')}
              style={styles.gif}
            />
          </View>

          <TouchableOpacity
            onPress={() => Linking.openURL('https://adamontheair.com')}
            style={styles.videoContainer}>
            <Video
              source={require('../../assets/banner5.mp4')}
              onBuffer={onBuffer}
              onError={onError}
              style={styles.video2}
              controls={true}
              repeat={true}
              resizeMode="cover"
              autoPlay={true}
            />
          </TouchableOpacity>
        </ScrollView>
      </ImageBackground>
    );
  } else {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          To use the SuperiorWeather App, please turn on your location services.
        </Text>
        <Text style={styles.errorInstructionText}>
          Here's how you can enable location services:
        </Text>
        <Icon2 name="settings" size={30} color="#4A90E2" />
        <Text style={styles.errorInstructionText}>
          1. Press the <Text style={styles.bold}>Go to Settings</Text> button.
        </Text>
        <Icon name="location-arrow" size={30} color="#4A90E2" />
        <Text style={styles.errorInstructionText}>
          2. Click on <Text style={styles.bold}>Locations</Text> button toggle
          is turned on.
        </Text>
        <Text style={styles.errorInstructionText}>
          2. Make sure location should be on{' '}
          <Text style={styles.bold}>While Using the App</Text> settings.
        </Text>

        <Image
          source={require('../../assets/images/AppIcon.png')} // Your app's logo
          style={styles.appLogo}
        />
        <Text style={styles.errorInstructionText}>
          4. If not, then select it and press{' '}
          <Text style={styles.bold}>Retry</Text> button on{' '}
          <Text style={styles.bold}>SuperiorWeather</Text> App.
        </Text>
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={styles.settingsButton}
            onPress={openSettingsWithInstructions}>
            <Text style={styles.retryText}>Go to Settings</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => {
              setLoading(true);
              Geolocation.getCurrentPosition(
                async position => {
                  const {latitude, longitude} = position.coords;
                  const roundedLatitude = latitude.toFixed(6);
                  const roundedLongitude = longitude.toFixed(6);
                  setLocation({
                    latitude: roundedLatitude,
                    longitude: roundedLongitude,
                  });
                  await getWeatherData(roundedLatitude, roundedLongitude);
                },
                error => {
                  console.log(error);
                  setLoading(false);
                },
                {enableHighAccuracy: true, timeout: 2000},
              );
              RNRestart.Restart();
            }}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
};

const getWeatherIcon = condition => {
  switch (condition) {
    case 'Clear':
      return 'sun-o';
    case 'Clouds':
      return 'cloud';
    case 'Rain':
      return 'umbrella';
    case 'Snow':
      return 'snowflake-o';
    case 'Thunderstorm':
      return 'bolt';
    case 'Drizzle':
      return 'tint';
    case 'Mist':
      return 'smog';
    default:
      return 'cloud';
  }
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    padding: 16,
    marginTop: 50,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#4A90E2',
    fontFamily: 'Raleway-Regular',
  },
  currentWeatherContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  cityText: {
    fontSize: 34,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    fontFamily: 'Raleway-Regular',
  },
  currentWeatherCard: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 18,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#fff',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  cityContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardContent: {
    fontSize: 18,
    color: '#fff',
    marginVertical: 6,
  },
  countryContent: {
    fontSize: 22,
    color: '#fff',
    fontWeight: 'bold',
    marginVertical: 4,
    fontFamily: 'Raleway-Regular',
  },
  temperatureText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
  },
  feelsLikeText: {
    fontSize: 24,
    color: '#fff',
    marginTop: 10,
  },
  weatherIcon: {
    marginVertical: 10,
  },
  conditionText: {
    fontSize: 28,
    color: '#fff',
    fontWeight: 'bold',
    fontFamily: 'Raleway-Regular',
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    borderRadius: 12,
    padding: 10,
    color: '#fff',
    marginBottom: 16,
    justifyContent: 'center',
    textAlign: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    fontFamily: 'Raleway-Regular',
  },
  forecastCard: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  forecastDate: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    fontFamily: 'Raleway-Regular',
  },
  forecastDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  forecastIcon: {
    marginRight: 10,
  },
  forecastTemp: {
    fontSize: 18,
    color: '#fff',
  },
  forecastCondition: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  hourlyCard: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 18,
    padding: 12,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'space-between',
    width: 150,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  hourlyTime: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  hourlyIcon: {
    marginVertical: 8,
  },
  hourlyTemp: {
    fontSize: 18,
    color: '#fff',
  },
  hourlyCondition: {
    fontSize: 18,
    color: '#fff',
    marginTop: 4,
    fontWeight: 'bold',
    textAlign: 'center',
    width: '100%',
    paddingHorizontal: 8,
    fontFamily: 'Raleway-Regular',
  },
  toggleButton: {
    padding: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 25,
    alignItems: 'center',
    marginVertical: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  toggleButtonText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    flex: 1,
    fontFamily: 'Raleway-Regular',
  },
  toggleIcon: {
    marginLeft: 10,
  },
  videoContainer: {
    marginVertical: 16,
    alignItems: 'center',
  },
  video: {
    width: '100%',
    height: 100,
    borderRadius: 10,
  },
  video2: {
    width: '100%',
    height: 300,
    borderRadius: 10,
  },
  gif: {
    width: '100%',
    height: 700,
    borderRadius: 10,
  },
  webViewContainer: {
    width: '100%',
    height: 250,
    marginBottom: 20,
  },
  webView: {
    flex: 1,
    borderRadius: 10,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    padding: 20,
  },
  errorText: {
    fontSize: 22,
    color: '#FF0000',
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    fontFamily: 'Raleway-Regular',
  },
  errorInstructionText: {
    fontSize: 20,
    color: '#333',
    textAlign: 'center',
    marginVertical: 5,
    fontFamily: 'Raleway-Regular',
  },
  retryButton: {
    backgroundColor: '#4A90E2',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    width: '40%',
    marginLeft: 5,
  },
  settingsButton: {
    backgroundColor: '#FF6347',
    borderRadius: 5,
    marginRight: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    width: '40%',
    marginVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  retryText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginTop: 20,
  },
  bold: {fontWeight: 'bold'},

  appLogo: {
    width: 50,
    height: 40,
  },
});

export default HomeScreen;
