/* eslint-disable no-shadow */
/* eslint-disable no-console */
/* eslint-disable no-undef */
/* eslint-disable no-alert */
/* eslint-disable import/prefer-default-export */
import React from 'react';
import { Text, View, Button, Alert } from 'react-native';
import AppNavigator from './RootNavigation';
import { colors } from '../../styles';
import * as AppleMusic from '../streaming-service/apple-music';
import * as Spotify from '../streaming-service/spotify';
import { StreamingServiceContext, findService } from '../streaming-service';
import { usePersistence } from '../persistence';

export const ValidUserView = () => {
  const [streamingService, persistStreamingService] = usePersistence(
    'streaming-service',
  );

  if (streamingService === 'INITIALIZING') {
    return null;
  }

  const connectToStreamingService = async (key) => {
    const service = findService(key);
    const [token, error] = await service.requestToken();
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
    await persistStreamingService({ key: service.uniqueKey, token });
  };

  // can automate this
  const connectWithAppleMusic = () =>
    connectToStreamingService(AppleMusic.uniqueKey);
  const connectWithSpotify = () => connectToStreamingService(Spotify.uniqueKey);

  if (!streamingService) {
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
    <StreamingServiceContext.Provider value={streamingService}>
      <AppNavigator />
    </StreamingServiceContext.Provider>
  );
};
