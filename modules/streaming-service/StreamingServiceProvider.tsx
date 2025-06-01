// import React, { useEffect } from 'react';

// import { Text, View, Button, DevSettings, Alert, AppState } from 'react-native';

// // import { remote } from 'react-native-spotify-remote';

// import { StartupProgress } from '@/components/StartupProgress';
// import { colors } from '@/styles';

// import * as AppleMusic from './apple-music';
// // import * as Spotify from './spotify';
// import { StreamingServiceContext as StreamingServiceContextType } from './types';
// import { StreamingServiceContext } from './StreamingServiceContext';
// import { findService } from '.';
// import { usePersistence } from '../persistence';

// export const StreamingServiceProvider: React.FC<{
//   children: React.ReactNode
// }> = ({ children }) => {
//   const [streamingServiceKey, persistStreamingServiceKey] = usePersistence<
//     string | undefined
//   >('streaming-service-default');
//   const [accessToken, persistAccessToken] = usePersistence<string | undefined>(
//     'streaming-service-auth'
//   );

//   const onAppStateChange = (state: string) => {
//     (async () => {
//       try {
//         switch (state) {
//           case 'active':
//             break;
//           case 'background':
//           case 'inactive':
//             // This was bad UX
//             // if (await remote.isConnectedAsync()) {
//             //   console.log('[Spotify] Leaving. Disconnecting...');
//             //   await remote.disconnect();
//             //   await auth.endSession();
//             //   console.log('[Spotify] Disconnected.');
//             // }
//             break;
//           default:
//             break;
//         }
//       } catch (e) {
//         // Convenience attempt to connect, failure is ok
//       }
//     })();
//   };

//   useEffect(() => {
//     const subscription = AppState.addEventListener('change', onAppStateChange);
//     return () => {
//       subscription.remove();
//     };
//   }, []);

//   const reset = () => persistAccessToken(undefined);

//   useEffect(() => {
//     if (__DEV__) {
//       const switchStreamingServiceOptionLabel =
//         'Korus: Switch streaming service';
//       DevSettings.addMenuItem(switchStreamingServiceOptionLabel, () => {
//         reset();
//       });
//     }
//   }, [reset]);

//   const connectToStreamingService = async (key: string) => {
//     const service = findService(key);
//     if (!service) {
//       Alert.alert('Error', 'Invalid streaming service selected');
//       return;
//     }

//     const [token, error] = await service.authenticate();
//     if (error) {
//       const errorMsg = typeof error === 'object' ? error.problem : error;
//       const action = typeof error === 'object' && error.solution?.action;
//       if (action) {
//         Alert.alert(
//           'Almost there',
//           errorMsg,
//           [
//             {
//               text: error.solution?.message || 'OK',
//               onPress: () => error.solution?.action()
//             },
//             {
//               text: 'Cancel',
//               onPress: () => {},
//               style: 'cancel'
//             }
//           ],
//           { cancelable: false }
//         );
//       } else {
//         Alert.alert('Error', errorMsg);
//       }
//       return;
//     }
//     await persistStreamingServiceKey(key);
//     await persistAccessToken(token);
//   };

//   // can automate this
//   const connectWithAppleMusic = () =>
//     connectToStreamingService(AppleMusic.uniqueKey);
//   // const connectWithSpotify = () => connectToStreamingService(Spotify.uniqueKey);

//   if (
//     streamingServiceKey === 'INITIALIZING' ||
//     accessToken === 'INITIALIZING'
//   ) {
//     return <StartupProgress />;
//   }

//   if (!streamingServiceKey || !accessToken) {
//     return (
//       <View
//         style={{
//           alignItems: 'center',
//           paddingTop: 80,
//           height: '100%',
//           backgroundColor: colors.black
//         }}
//       >
//         <Text
//           style={{
//             color: 'white',
//             margin: 50,
//             marginHorizontal: 'auto',
//             fontWeight: '600',
//             fontSize: 22,
//             textAlign: 'center'
//           }}
//         >
//           Connect to your music.
//         </Text>
//         <View style={{ alignItems: 'center' }}>
//           <Button title="Apple Music" onPress={connectWithAppleMusic} />
//           <Text style={{ color: 'white', marginVertical: 15 }}>or</Text>
//           {/* <Button title="Spotify" onPress={connectWithSpotify} /> */}
//         </View>
//       </View>
//     );
//   }

//   const contextValue: StreamingServiceContextType = {
//     key: streamingServiceKey,
//     accessToken,
//     reset,
//     connectPlayer: async (playUri: string) => {
//       // if (streamingServiceKey !== Spotify.uniqueKey) {
//       // throw new Error('Temp spotify code');
//       // }
//       const log = (msg: string) => console.debug(`[Spotify] ${msg}`);
//       log('Connecting player...');
//       // const service = findService(Spotify.uniqueKey);
//       // if (!service?.connect) {
//       //   throw new Error(
//       //     'Spotify service not found or connect method not available'
//       //   );
//       // }
//       // const [accessToken, error] = await service.connect(playUri);

//       // if (error) {
//       //   // No session (shouldn't happen)
//       //   console.debug('connectPlayer failed.');
//       //   return;
//       // }

//       console.debug('Token received:');
//       console.debug(accessToken);

//       log('Persisting token...');
//       await persistAccessToken(accessToken);
//       log('Done.');
//     }
//   };

//   return (
//     <StreamingServiceContext.Provider value={contextValue}>
//       {children}
//     </StreamingServiceContext.Provider>
//   );
// };
