/* eslint-disable no-shadow */
/* eslint-disable no-console */
/* eslint-disable no-undef */
/* eslint-disable no-alert */
/* eslint-disable import/prefer-default-export */
import React from 'react';
import { Text, View, Button, Alert, AppState } from 'react-native';
import { remote } from 'react-native-spotify-remote';
import analytics from '@react-native-firebase/analytics';
import AppNavigator from './RootNavigation';
import { colors } from '../../styles';
import * as AppleMusic from '../streaming-service/apple-music';
import * as Spotify from '../streaming-service/spotify';
import { findService } from '../streaming-service';
import { StreamingServiceContext } from '../streaming-service/StreamingServiceContext.ts';
import { usePersistence } from '../persistence';
import { StartupProgress } from './StartupProgress';
// import auth from '@react-native-firebase/auth';
// import AsyncStorage from '@react-native-community/async-storage';

// // DevSettings.addMenuItem('Clear storage', () => {
// //   AsyncStorage.clear();
// // });

// // DevSettings.addMenuItem('Sign out', () => {
// //   auth().signOut();
// // });

export const ValidUserView = () => {
  const [streamingServiceKey, persistStreamingServiceKey] = usePersistence(
    'streaming-service-default',
  );
  const [accessToken, persistAccessToken] = usePersistence(
    'streaming-service-auth',
  );

  const onAppStateChange = (state) => {
    (async () => {
      try {
        switch (state) {
          case 'active':
            if (!(await remote.isConnectedAsync())) {
              await remote.connect(accessToken);
            }
            break;
          case 'background':
          case 'inactive':
            if (await remote.isConnectedAsync()) {
              await remote.disconnect();
            }
            break;
          default:
            break;
        }
      } catch (e) {
        // Convenience attempt to connect, failure is ok
      }
    })();
  };

  React.useEffect(() => {
    AppState.addEventListener('change', onAppStateChange);

    return () => {
      AppState.removeEventListener('change', onAppStateChange);
    };
  }, []);

  const connectToStreamingService = async (key) => {
    const service = findService(key);
    const [token, error] = await service.authenticate();
    if (error) {
      const errorMsg = typeof error === 'object' ? error.problem : error;
      const action = typeof error === 'object' && error.solution.action;
      if (action) {
        Alert.alert(
          'Almost there',
          errorMsg,
          [
            {
              text: error.solution.message,
              onPress: () => error.solution.action(),
            },
            {
              text: 'Cancel',
              onPress: () => {},
              style: 'cancel',
            },
          ],
          { cancelable: false },
        );
      } else {
        alert(errorMsg);
      }
      return;
    }
    await persistStreamingServiceKey(key);
    await persistAccessToken(token);
  };

  // can automate this
  const connectWithAppleMusic = () =>
    connectToStreamingService(AppleMusic.uniqueKey);
  const connectWithSpotify = () => connectToStreamingService(Spotify.uniqueKey);

  if (
    streamingServiceKey === 'INITIALIZING' ||
    accessToken === 'INITIALIZING'
  ) {
    return <StartupProgress />;
  }

  if (!streamingServiceKey || !accessToken) {
    return (
      <View
        style={{
          alignItems: 'center',
          paddingTop: 80,
          height: '100%',
          backgroundColor: colors.black,
        }}
      >
        <Text
          style={{
            color: 'white',
            margin: 50,
            marginHorizontal: 'auto',
            fontWeight: '600',
            fontSize: 22,
            textAlign: 'center',
          }}
        >
          Connect to your music.
        </Text>
        <View style={{ alignItems: 'center' }}>
          <Button title="Apple Music" onPress={connectWithAppleMusic} />
          <Text style={{ color: 'white', marginVertical: 15 }}>or</Text>
          <Button title="Spotify" onPress={connectWithSpotify} />
        </View>
      </View>
    );
  }

  return (
    <StreamingServiceContext.Provider
      value={{
        key: streamingServiceKey,
        accessToken,
        reset: () => {
          persistAccessToken(undefined);
        },
        connectPlayer: async (playUri) => {
          if (streamingServiceKey !== Spotify.uniqueKey) {
            throw new Error('Temp spotify code');
          }
          const log = (msg) => console.debug(`[Spotify] ${msg}`);
          log('Connecting player...');
          const [accessToken, error] = await findService(
            Spotify.uniqueKey,
          ).connect(playUri);

          if (error) {
            // No session (shouldn't happen)
            log('Refresh failed.');
            await persistAccessToken(undefined);
            return;
          }

          console.debug('Token received:');
          console.debug(accessToken);

          log('Persisting token...');
          await persistAccessToken(accessToken);
          log('Done.');
        },
      }}
    >
      {(() => {
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

        const getActiveRouteName = (state) => {
          const route = state.routes && state.routes[state.index];

          if (route) {
            // Dive into nested navigators
            return getActiveRouteName(route);
          }

          return state.routeName;
        };
        return (
          <AppNavigator
            onNavigationStateChange={(prevState, nextState, _action) => {
              const prevScreen = getActiveRouteName(prevState);
              const nextScreen = getActiveRouteName(nextState);
              if (prevScreen !== nextScreen) {
                analytics().setCurrentScreen(nextScreen, nextScreen);
              }
            }}
          />
        );
      })()}
    </StreamingServiceContext.Provider>
  );
};
