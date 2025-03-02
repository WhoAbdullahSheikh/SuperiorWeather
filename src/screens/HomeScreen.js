import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
  Image,
} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import axios from 'axios';
import moment from 'moment';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon2 from 'react-native-vector-icons/Feather';
import Video from 'react-native-video';
import SocialMediaSection from '../navigation/SocialMediaSection';
import WebView from 'react-native-webview';
import {
  scheduleWeatherNotification,
  configurePushNotifications,
} from '../services/NotificationService';
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

  const onBuffer = buffer => {
    console.log('Buffering...', buffer);
  };

  const onError = error => {
    console.error('Video Error:', error);
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
      {enableHighAccuracy: true, timeout: 15000},
    );
    _setBackgroundImage();
  }, []);

  const scheduleDailyTask = () => {
    console.log('Scheduling daily task...');
    BackgroundTimer.stopBackgroundTimer();

    BackgroundTimer.runBackgroundTimer(() => {
      console.log('Running background task...');
      if (location) {
        getWeatherData(location.latitude, location.longitude);
      }
    }, 24 * 60 * 60 * 1000);
  };

  useEffect(() => {
    if (location) {
      scheduleDailyTask();
    }

    return () => {
      BackgroundTimer.stopBackgroundTimer();
    };
  }, [location]);

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

  const getWeatherData = async (latitude, longitude) => {
    try {
      const API_KEY = 'UB5VAZNTAAW4QEGG7XAS34XQ6';
      const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${latitude},${longitude}?key=${API_KEY}`;

      const response = await axios.get(url);
      if (response.data && response.data.currentConditions) {
        setWeather(response.data);
        setLoading(false);

        if (!weather) {
          scheduleWeatherNotification(response.data.currentConditions);
        }
      } else {
        console.log('Error: Data structure is not as expected.');
        setLoading(false);
      }
    } catch (error) {
      console.error('Error fetching weather data: ', error);
      setLoading(false);
    }
  };

  const toggleExpand = () => {
    setExpanded(prevState => !prevState);
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
        <ScrollView style={styles.container}>
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

          <View style={styles.videoContainer}>
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
          </View>
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

          <View style={styles.videoContainer}>
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
          </View>
        </ScrollView>
      </ImageBackground>
    );
  } else {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Unable to fetch weather data.</Text>
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
  },
  errorText: {
    fontSize: 18,
    color: '#FF0000',
    fontFamily: 'Raleway-Regular',
  },
});

export default HomeScreen;
