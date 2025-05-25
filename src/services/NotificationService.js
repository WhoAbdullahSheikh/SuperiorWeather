import PushNotification from 'react-native-push-notification';

const configurePushNotifications = () => {
  PushNotification.configure({
    onRegister: function (token) {
      console.log('TOKEN:', token);
    },
    onNotification: function (notification) {
      console.log('NOTIFICATION:', notification);
    },
    permissions: {
      alert: true,
      badge: true,
      sound: true,
    },
    popInitialNotification: true,
    requestPermissions: true,
  });

  PushNotification.createChannel(
    {
      channelId: 'weather-alerts',
      channelName: 'Weather Alert Notifications',
      channelDescription: 'Notifications for important weather alerts',
      importance: 4,
      vibrate: true,
      soundName: 'default',
    },
    created => console.log(`Channel created: ${created}`),
  );
};

const generateWeatherAlerts = weatherInfo => {
  const alerts = [];
  const {
    temperature,
    precipProbability,
    windSpeed,
    uvIndex,
    conditions,
    humidity,
  } = weatherInfo;

  if (temperature >= 40) {
    alerts.push(
      `🔥 EXTREME Heat Alert! Temperature is dangerously high at ${Math.round(
        temperature,
      )}°F. Stay indoors and stay hydrated!`,
    );
  } else if (temperature >= 35) {
    alerts.push(
      `🌡️ Heat Alert! High temperature of ${Math.round(
        temperature,
      )}°F. Stay hydrated and avoid prolonged sun exposure.`,
    );
  } else if (temperature <= 0) {
    alerts.push(
      `❄️ Freezing Alert! Temperature is below freezing at ${Math.round(
        temperature,
      )}°F. Bundle up!`,
    );
  }

  if (precipProbability > 75) {
    alerts.push(
      `⛈️ Heavy Rain Alert! ${Math.round(
        precipProbability,
      )}% chance of precipitation. Carry an umbrella!`,
    );
  } else if (precipProbability > 50) {
    alerts.push(
      `☔ Rain Likely! ${Math.round(
        precipProbability,
      )}% chance of precipitation.`,
    );
  }

  if (windSpeed > 50) {
    alerts.push(
      `🌪️ Severe Wind Alert! Very strong winds at ${Math.round(
        windSpeed,
      )}km/h. Stay safe!`,
    );
  } else if (windSpeed > 30) {
    alerts.push(`💨 Strong Wind Alert! Winds at ${Math.round(windSpeed)}km/h.`);
  }

  if (uvIndex >= 8) {
    alerts.push(
      `☀️ Extreme UV Alert! UV Index: ${Math.round(
        uvIndex,
      )}. Use strong sun protection!`,
    );
  } else if (uvIndex >= 6) {
    alerts.push(
      `😎 High UV Alert! UV Index: ${Math.round(uvIndex)}. Use sun protection.`,
    );
  }

  if (conditions.toLowerCase().includes('thunderstorm')) {
    alerts.push(`⚡ Thunderstorm Alert! Take necessary precautions.`);
  } else if (conditions.toLowerCase().includes('snow')) {
    alerts.push(
      `🌨️ Snow Alert! Expect snowfall and possible travel disruptions.`,
    );
  } else if (conditions.toLowerCase().includes('fog')) {
    alerts.push(`🌫️ Foggy Conditions! Drive carefully.`);
  }

  if (humidity > 80) {
    alerts.push(
      `💧 High Humidity Alert! ${Math.round(
        humidity,
      )}% humidity. May feel uncomfortable.`,
    );
  } else if (humidity < 30) {
    alerts.push(
      `📉 Low Humidity Alert! ${Math.round(
        humidity,
      )}% humidity. Stay hydrated.`,
    );
  }

  return alerts;
};

const triggerWeatherAlerts = weatherInfo => {
  const alerts = generateWeatherAlerts(weatherInfo);

  alerts.forEach((alert, index) => {
    PushNotification.localNotification({
      channelId: 'weather-alerts',
      title: 'Weather Alert',
      message: alert,
      playSound: true,
      soundName: 'default',
      importance: 'high',
      vibrate: true,
      vibration: 300,
      priority: 'high',
      when: new Date(Date.now() + index * 1000),
    });
  });

  scheduleAllDailyNotifications(weatherInfo);
};

const scheduleAllDailyNotifications = weatherInfo => {
  const {
    conditions,
    temperature,
    humidity,
    precipProbability,
    uvIndex,
    windSpeed,
  } = weatherInfo;

  PushNotification.cancelAllLocalNotifications();

  scheduleNotification(
    weatherInfo,
    {hour: 6, minute: 0},
    `🌅 Good Morning from Superior Weather!\nTemperature: ${Math.round(temperature)}°F, Condition: ${conditions}`,
    false,
  );

  const activeAlerts = generateWeatherAlerts(weatherInfo);

  let fullDetailMessage = `
🌤️ Weather Update:
• Condition: ${conditions}
• Temperature: ${Math.round(temperature)}°F
• Humidity: ${Math.round(humidity)}%
• Precipitation: ${Math.round(precipProbability)}% chance
• UV Index: ${Math.round(uvIndex)}
• Wind Speed: ${Math.round(windSpeed)} km/h
  `.trim();

  if (activeAlerts.length > 0) {
    fullDetailMessage += `\n\n⚠️ Weather Alerts:\n${activeAlerts.join('\n')}`;
  }

  const fullDetailTimes = [
    {hour: 12, minute: 0},
    {hour: 16, minute: 0},
    {hour: 0, minute: 0},
  ];

  fullDetailTimes.forEach(time => {
    scheduleNotification(weatherInfo, time, fullDetailMessage, true);
  });
};

const scheduleNotification = (weatherInfo, time, message, isRepeating) => {
  const notificationTime = new Date();
  notificationTime.setHours(time.hour);
  notificationTime.setMinutes(time.minute);
  notificationTime.setSeconds(0);

  if (notificationTime < new Date()) {
    notificationTime.setDate(notificationTime.getDate() + 1);
  }

  PushNotification.localNotificationSchedule({
    channelId: 'weather-alerts',
    title: 'Weather Update',
    message: message,
    date: notificationTime,
    repeatType: isRepeating ? 'day' : undefined,
    playSound: true,
    soundName: 'default',
  });
};

export {configurePushNotifications, triggerWeatherAlerts};
