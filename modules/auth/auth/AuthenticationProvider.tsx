import React, { useState, useEffect } from 'react';
import { View, Text, DevSettings } from 'react-native';
import { getAuth, User } from 'firebase/auth';
import {
  appleAuth,
  AppleButton
} from '@invertase/react-native-apple-authentication';
import { StartupProgress } from '@/components/StartupProgress';
import { signInWithApple } from './AppleSignin';
import { colors } from '@/styles';

import { AuthNContext } from '.';
import { DevSignIn } from './PhoneAuth';

if (__DEV__) {
  DevSettings.addMenuItem('Korus: Sign out', () => {
    getAuth().signOut();
  });
}

export default function AuthenticationProvider({
  children
}: {
  children: React.ReactNode
}) {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [userToken, setUserToken] = useState<string | null>(null);

  const refreshToken = async () => {
    if (!user) {
      console.debug('No user. Refresh token skipped.');
      return;
    }
    console.debug('Refreshing token...');
    const token = await user.getIdToken(true);
    console.debug('Token refreshed & set.');
    setUserToken(token);
  };

  // Handle user state changes
  const onStateChanged = async (user: User | null) => {
    setUser(user);

    if (user) {
      const userToken = await user.getIdToken();
      setUserToken(userToken);
    }

    if (initializing) {
      setInitializing(false);
    }
  };

  useEffect(() => {
    const subscriber = getAuth().onAuthStateChanged((user) => {
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
          backgroundColor: colors.black
        }}
      >
        <Text
          style={{
            color: 'white',
            margin: 100,
            marginHorizontal: 'auto',
            fontWeight: '600',
            fontSize: 30,
            textAlign: 'center'
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
              height: 45 * 1.3
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

        <DevSignIn />
      </View>
    );
  }

  console.debug('AuthenticationProvider render');

  return (
    <AuthNContext.Provider value={{ user, userToken, refreshToken }}>
      {children}
    </AuthNContext.Provider>
  );
}
