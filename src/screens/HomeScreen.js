import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import axios from 'axios';
import moment from 'moment';
import Icon from 'react-native-vector-icons/FontAwesome';

const fahrenheitToCelsius = fahrenheit => {
  return Math.round(((fahrenheit - 32) * 5) / 9);  // Now rounding the Celsius value
};

const HomeScreen = () => {
  const [location, setLocation] = useState(null);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Geolocation.getCurrentPosition(
      async position => {
        const { latitude, longitude } = position.coords;
        const roundedLatitude = latitude.toFixed(6);
        const roundedLongitude = longitude.toFixed(6);
  
        setLocation({ latitude: roundedLatitude, longitude: roundedLongitude });
        await getWeatherData(roundedLatitude, roundedLongitude); // Fetch weather data
      },
      error => {
        console.log(error);
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 15000 },
    );
  }, []);

  const getWeatherData = async (latitude, longitude) => {
    try {
      const API_KEY = 'UB5VAZNTAAW4QEGG7XAS34XQ6'; // Weather API key
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
      <ScrollView style={styles.container}>
        <View style={styles.currentWeatherContainer}>
          <Text style={styles.temperatureText}>
            {fahrenheitToCelsius(weather.currentConditions.temp)}°C  {/* Rounded temperature */}
          </Text>

          <Icon
            name={getWeatherIcon(weather.currentConditions.conditions)}
            size={100}
            color="#4A90E2"
            style={styles.weatherIcon}
          />
          <Text style={styles.conditionText}>
            {weather.currentConditions.conditions}
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
                  {fahrenheitToCelsius(hour.temp)}°C  {/* Rounded temperature */}
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
                {fahrenheitToCelsius(day.tempmin)}°C  {/* Rounded temperature */}
              </Text>
            </View>
            <Text style={styles.forecastCondition}>{day.conditions}</Text>
          </View>
        ))}
      </ScrollView>
    );
  } else {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Unable to fetch weather data.</Text>
      </View>
    );
  }
};

// Function to map weather conditions to icon names
const getWeatherIcon = condition => {
  switch (condition) {
    case 'Clear':
      return 'sun-o'; // FontAwesome icon for sun
    case 'Clouds':
      return 'cloud'; // FontAwesome icon for cloud
    case 'Rain':
      return 'cloud-rain'; // FontAwesome icon for rain
    case 'Snow':
      return 'snowflake-o'; // FontAwesome icon for snow
    case 'Thunderstorm':
      return 'bolt'; // FontAwesome icon for thunderstorm
    case 'Drizzle':
      return 'cloud-sun-rain'; // FontAwesome icon for drizzle
    case 'Mist':
      return 'smog'; // FontAwesome icon for mist
    default:
      return 'cloud'; // Default icon if condition is unknown
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 16,
    marginTop: 40
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
  temperatureText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#4A90E2',
  },
  weatherIcon: {
    marginVertical: 10,
  },
  conditionText: {
    fontSize: 18,
    color: '#666',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  forecastCard: {
    backgroundColor: '#FFF',
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
    color: '#333',
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
    color: '#666',
  },
  forecastCondition: {
    fontSize: 14,
    color: '#888',
  },
  hourlyCard: {
    backgroundColor: '#FFF',
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
    color: '#333',
  },
  hourlyIcon: {
    marginVertical: 8,
  },
  hourlyTemp: {
    fontSize: 14,
    color: '#666',
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
