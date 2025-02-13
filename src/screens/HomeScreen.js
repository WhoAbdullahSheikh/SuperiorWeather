import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import Geolocation from '@react-native-community/geolocation';  // For getting the user's location
import axios from 'axios';  // For making API calls to fetch weather data

const HomeScreen = () => {
  const [location, setLocation] = useState(null);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get the user's location when the component mounts
    Geolocation.getCurrentPosition(
      async position => {
        const { latitude, longitude } = position.coords;
        setLocation({ latitude, longitude });
        
        // Fetch weather data based on the user's location
        await getWeatherData(latitude, longitude);
      },
      error => {
        console.log(error);
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  }, []);

  const getWeatherData = async (latitude, longitude) => {
    try {
      const API_KEY = '8ad867af67a944d285a73704251302';  // Replace with your WeatherAPI key
      const url = `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${latitude},${longitude}&aqi=no`;

      const response = await axios.get(url);
      setWeather(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching weather data: ", error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {weather ? (
        <>
          <Text style={styles.text}>Weather in {weather.location.name}</Text>
          <Text style={styles.temp}>{weather.current.temp_c}°C</Text>
          <Text style={styles.description}>{weather.current.condition.text}</Text>
        </>
      ) : (
        <Text style={styles.text}>Unable to fetch weather data.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    marginBottom: 10,
  },
  temp: {
    fontSize: 40,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 18,
    color: '#888',
  },
});

export default HomeScreen;
