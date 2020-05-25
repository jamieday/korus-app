// Must be at the very TOP - https://reactnavigation.org/docs/getting-started/
import 'react-native-gesture-handler';

import React from 'react';
import { VersionGuard } from './src/modules/version/VersionGuard';
import { AuthenticationProvider } from './src/modules/auth/AuthenticationProvider';
import { StreamingServiceProvider } from './src/modules/streaming-service/StreamingServiceProvider';

import { SetUsernameGuard } from './src/modules/auth/SetUsernameGuard';
import { NavigationProvider } from './src/modules/navigation/NavigationProvider';
import { RootStack } from './src/modules/navigation/RootStack';
import { PlaybackContextProvider } from './src/modules/streaming-service/PlaybackContext';

// const api = useApi();

// const registerToken = (token) =>
//   api.post('/push-notifications/register', {
//     deviceToken: token,
//   });

// React.useEffect(() => {
//   // ask for push notification permission
//   messaging().requestPermission({ provisional: true });
//   messaging().getToken().then(registerToken);

//   return messaging().onTokenRefresh(registerToken);
// }, []);

export default () => (
  <NavigationProvider>
    <VersionGuard>
      <AuthenticationProvider>
        <SetUsernameGuard>
          <StreamingServiceProvider>
            <PlaybackContextProvider>
              <RootStack />
            </PlaybackContextProvider>
          </StreamingServiceProvider>
        </SetUsernameGuard>
      </AuthenticationProvider>
    </VersionGuard>
  </NavigationProvider>
);
