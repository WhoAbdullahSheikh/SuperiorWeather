import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  ImageBackground,
  Image,
} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import axios from 'axios';
import moment from 'moment';
import Icon from 'react-native-vector-icons/FontAwesome';
import Video from 'react-native-video';

const fahrenheitToCelsius = fahrenheit => {
  return Math.round(((fahrenheit - 32) * 5) / 9);
};

const HomeScreen = () => {
  const [location, setLocation] = useState(null);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  const onBuffer = buffer => {
    console.log('Buffering...', buffer);
  };

  const onError = error => {
    console.error('Video Error:', error);
  };

  useEffect(() => {
    Geolocation.getCurrentPosition(
      async position => {
        const {latitude, longitude} = position.coords;
        const roundedLatitude = latitude.toFixed(6);
        const roundedLongitude = longitude.toFixed(6);

        setLocation({latitude: roundedLatitude, longitude: roundedLongitude});
        await getWeatherData(roundedLatitude, roundedLongitude);
      },
      error => {
        console.log(error);
        setLoading(false);
      },
      {enableHighAccuracy: true, timeout: 15000},
    );
  }, []);

  const getWeatherData = async (latitude, longitude) => {
    try {
      const API_KEY = 'UB5VAZNTAAW4QEGG7XAS34XQ6';
      const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${latitude},${longitude}?key=${API_KEY}`;

      const response = await axios.get(url);
      if (response.data && response.data.currentConditions) {
        setWeather(response.data);
        setLoading(false);
      } else {
        console.log('Error: Data structure is not as expected.');
        setLoading(false);
      }
    } catch (error) {
      console.error('Error fetching weather data: ', error);
      setLoading(false);
    }
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
      <ImageBackground
        source={require('../../assets/images/day.jpg')}
        style={styles.backgroundImage}>
        <ScrollView style={styles.container}>
          <View style={styles.currentWeatherContainer}>
            <Text style={styles.temperatureText}>
              {fahrenheitToCelsius(weather.currentConditions.temp)}°C
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
          </View>
          <View style={styles.currentWeatherCard}>
            <Text style={styles.cardTitle}>Current Weather Details</Text>
            <Text style={styles.cardContent}>
              Latitude: {location.latitude}
            </Text>
            <Text style={styles.cardContent}>
              Longitude: {location.longitude}
            </Text>
            <Text style={styles.cardContent}>
              Weather: {weather.currentConditions.conditions}
            </Text>
            <Text style={styles.cardContent}>
              Temperature: {fahrenheitToCelsius(weather.currentConditions.temp)}
              °C
            </Text>
          </View>
          <Text style={styles.sectionTitle}>Hourly Forecast</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {weather.days[0].hours.slice(0, 24).map((hour, index) => {
              const formattedTime = hour.datetime
                ? moment(hour.datetime, 'HH:mm:ss').format('h A')
                : 'Invalid time';

              return (
                <View key={index} style={styles.hourlyCard}>
                  <Text style={styles.hourlyTime}>{formattedTime}</Text>
                  <Icon
                    name={getWeatherIcon(hour.conditions)}
                    size={40}
                    color="#4A90E2"
                    style={styles.hourlyIcon}
                  />
                  <Text style={styles.hourlyTemp}>
                    {fahrenheitToCelsius(hour.temp)}°C
                  </Text>
                </View>
              );
            })}
          </ScrollView>

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
                  color="#4A90E2"
                  style={styles.forecastIcon}
                />
                <Text style={styles.forecastTemp}>
                  Day: {fahrenheitToCelsius(day.tempmax)}°C | Night:{' '}
                  {fahrenheitToCelsius(day.tempmin)}°C
                </Text>
              </View>
              <Text style={styles.forecastCondition}>{day.conditions}</Text>
            </View>
          ))}

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
      return 'cloud-rain';
    case 'Snow':
      return 'snowflake-o';
    case 'Thunderstorm':
      return 'bolt';
    case 'Drizzle':
      return 'cloud-sun-rain';
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
    marginTop: 46,
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
  },
  currentWeatherContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  currentWeatherCard: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#fff',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  cardContent: {
    fontSize: 16,
    color: '#fff',
    marginVertical: 4,
  },
  temperatureText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
  },
  weatherIcon: {
    marginVertical: 10,
  },
  conditionText: {
    fontSize: 18,
    color: '#fff',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  forecastCard: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  forecastDate: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
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
    fontSize: 16,
    color: '#fff',
  },
  forecastCondition: {
    fontSize: 14,
    color: '#fff',
  },
  hourlyCard: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 10,
    padding: 12,
    marginRight: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  hourlyTime: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
  hourlyIcon: {
    marginVertical: 8,
  },
  hourlyTemp: {
    fontSize: 14,
    color: '#fff',
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  errorText: {
    fontSize: 18,
    color: '#FF0000',
  },
});

export default HomeScreen;
