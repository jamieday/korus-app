import React from 'react';
import { Text, View, Button, DevSettings, Alert, AppState } from 'react-native';
import { remote } from 'react-native-spotify-remote';
import { colors } from '../../styles';
import * as AppleMusic from './apple-music';
import * as Spotify from './spotify';
import { findService } from '.';
import { StreamingServiceContext } from './StreamingServiceContext';
import { usePersistence } from '../persistence';
import { StartupProgress } from '../StartupProgress';

export const StreamingServiceProvider = ({ children }) => {
  const [streamingServiceKey, persistStreamingServiceKey] = usePersistence(
    'streaming-service-default',
  );
  const [accessToken, persistAccessToken] = usePersistence(
    'streaming-service-auth',
  );

  const tryConnectSpotify = async () => {
    if (streamingServiceKey !== Spotify.uniqueKey) {
      return;
    }
    if (!(await remote.isConnectedAsync())) {
      console.log('[Spotify] Returning. Connecting...');
      await connectToStreamingService(Spotify.uniqueKey);
      console.log('[Spotify] Connected.');
    }
  };

  const onAppStateChange = (state) => {
    (async () => {
      try {
        switch (state) {
          case 'active':
            await tryConnectSpotify();
            break;
          case 'background':
          case 'inactive':
            // This was bad UX
            // if (await remote.isConnectedAsync()) {
            //   console.log('[Spotify] Leaving. Disconnecting...');
            //   await remote.disconnect();
            //   await auth.endSession();
            //   console.log('[Spotify] Disconnected.');
            // }
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
    tryConnectSpotify();
  }, [streamingServiceKey]);

  React.useEffect(() => {
    AppState.addEventListener('change', onAppStateChange);

    return () => {
      AppState.removeEventListener('change', onAppStateChange);
    };
  }, []);

  const reset = () => persistAccessToken(undefined);

  React.useEffect(() => {
    if (__DEV__) {
      const switchStreamingServiceOptionLabel =
        'Korus: Switch streaming service';
      DevSettings.addMenuItem(switchStreamingServiceOptionLabel, () => {
        reset();
      });
    }
  }, [reset]);

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
        reset,
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
            console.debug('connectPlayer failed.');
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
      {children}
    </StreamingServiceContext.Provider>
  );
};
