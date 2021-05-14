import React, { useState, useEffect } from 'react';
import { View, Text, DevSettings } from 'react-native';
import auth from '@react-native-firebase/auth';
import {
  appleAuth,
  AppleButton,
} from '@invertase/react-native-apple-authentication';
import analytics from '@react-native-firebase/analytics';
import { StartupProgress } from '../StartupProgress';
import { signInWithApple } from '../navigation/packages/AppleSignIn';
import { colors } from '../../styles';

import { AuthNContext } from '.';
import { DevSignIn } from './PhoneAuth';

if (__DEV__) {
  DevSettings.addMenuItem('Korus: Sign out', () => {
    auth().signOut();
  });
}

export const AuthenticationProvider = ({ children }) => {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();
  const [userToken, setUserToken] = useState();

  const refreshToken = async () => {
    const token = await user.getIdToken(true);
    setUserToken(token);
  };

  // Handle user state changes
  const onStateChanged = async (user) => {
    setUser(user);

    if (user) {
      const userToken = await user.getIdToken();
      setUserToken(userToken);

      try {
        analytics().setUserId(user.uid);
        analytics().setUserProperty('username', user.displayName);
      } catch (e) {
        // Analytics failure
      }
    }

    if (initializing) {
      setInitializing(false);
    }
  };

  useEffect(() => {
    const subscriber = auth().onUserChanged((user) => {
      onStateChanged(user);
    });
    return subscriber; // unsubscribe on unmount
  }, []);

  if (initializing) {
    return <StartupProgress />;
  }

  if (!user) {
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
            margin: 100,
            marginHorizontal: 'auto',
            fontWeight: '600',
            fontSize: 30,
            textAlign: 'center',
          }}
        >
          Let's get started.
        </Text>

        {appleAuth.isSupported ? (
          <AppleButton
            buttonStyle={AppleButton.Style.WHITE}
            buttonType={AppleButton.Type.SIGN_IN}
            style={{
              width: 160 * 1.3,
              height: 45 * 1.3,
            }}
            onPress={signInWithApple}
          />
        ) : (
          <Text
            style={{ color: colors.lightGray, margin: 20, textAlign: 'center' }}
          >
            Sorry, we only support iOS 13 right now. Please update! If this is a
            dealbreaker for you, let us know.
          </Text>
        )}

        <View style={{ marginTop: 20 }}>
          <DevSignIn />
        </View>
      </View>
    );
  }

  return (
    <AuthNContext.Provider value={{ user, userToken, refreshToken }}>
      {children}
    </AuthNContext.Provider>
  );
};
