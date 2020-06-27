import React from 'react';
import { useApi } from '../api';
import messaging from '@react-native-firebase/messaging';

export const PushNotificationProvider = ({ children }) => {
  const api = useApi();

  const registerDeviceToken = (deviceToken) =>
    api.post(`/activity/push-notifications/register`, {
      deviceToken,
    });

  React.useEffect(() => {
    (async () => {
      // ask for push notification permission
      const authStatus = await messaging().requestPermission();
      console.log(`Authenticated push notifications: ${authStatus}`);
      registerDeviceToken(await messaging().getToken());
    })();
    return messaging().onTokenRefresh(registerDeviceToken);
  }, []);

  return children;
};
