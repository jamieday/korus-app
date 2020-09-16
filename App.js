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
import { PushNotificationProvider } from './src/modules/notification/PushNotificationProvider';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default () => (
  <SafeAreaProvider>
    <NavigationProvider>
      <VersionGuard>
        <AuthenticationProvider>
          <SetUsernameGuard>
            <PushNotificationProvider>
              <StreamingServiceProvider>
                <PlaybackContextProvider>
                  <RootStack />
                </PlaybackContextProvider>
              </StreamingServiceProvider>
            </PushNotificationProvider>
          </SetUsernameGuard>
        </AuthenticationProvider>
      </VersionGuard>
    </NavigationProvider>
  </SafeAreaProvider>
);
