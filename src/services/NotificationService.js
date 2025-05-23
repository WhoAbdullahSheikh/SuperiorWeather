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
};

const scheduleWeatherNotification = weatherData => {
  console.log('Scheduling weather notification...');
  const {conditions, temp} = weatherData;

  PushNotification.cancelAllLocalNotifications();
  PushNotification.localNotificationSchedule({
    channelId: 'weather-alerts',
    title: 'Good Morning from Superior Weather! 🌤️',
    message: `Weather's Update:
Likely ${temp}° F, Condition: "${conditions}"`,
    date: new Date(new Date().setHours(5, 15, 30)),
    allowWhileIdle: true,
    repeatType: 'day',
  });
};
export {configurePushNotifications, scheduleWeatherNotification};
