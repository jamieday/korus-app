import { Provider } from 'react-redux';
import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { PersistGate } from 'redux-persist/integration/react';
import { colors } from './src/styles';

import { store, persistor } from './src/redux/store';

import AppView from './src/modules/AppViewContainer';

import messaging from '@react-native-firebase/messaging';
 
export default function App() {
  React.useEffect(() => {
    await messaging().registerForRemoteNotifications();

    // ask for push notification permission
    await messaging().requestPermission();
  }, []);

  return (
    <Provider store={store}>
      <PersistGate
        loading={
          // eslint-disable-next-line react/jsx-wrap-multilines
          <View style={styles.container}>
            <ActivityIndicator color={colors.red} />
          </View>
        }
        persistor={persistor}
      >
        <AppView />
      </PersistGate>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
});
