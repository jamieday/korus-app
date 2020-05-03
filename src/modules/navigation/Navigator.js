import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import AppNavigator from './RootNavigation';
// import messaging from '@react-native-firebase/messaging';
import auth from '@react-native-firebase/auth';
import appleAuth, {
  AppleButton,
} from '@invertase/react-native-apple-authentication';
import { signInWithApple } from './packages/AppleSignIn';
import { colors } from '../../styles';
import { Button, TextInput } from '../../components';
import crashlytics from '@react-native-firebase/crashlytics';

export const AuthNContext = React.createContext(undefined);

export default function NavigatorView() {
  // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  // Handle user state changes
  function onStateChanged(user) {
    crashlytics().log('User state changed');
    if (user) {
      crashlytics().setUserId(user.uid);
      if (user.displayName) crashlytics().setUserName(user.displayName);
      if (user.email) crashlytics().setUserEmail(user.email);
    } else {
      crashlytics().log('User logged out');
    }
    setUser(user);
    if (initializing) {
      setInitializing(false);
    }
  }

  useEffect(() => {
    crashlytics().log('App mounted');
    const subscriber = auth().onUserChanged(onStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  if (initializing) {
    return null;
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
          Try to figure out how to sign up.
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
      </View>
    );
  }

  const Startup = () => {
    const [usernameQueued, setUsernameQueued] = useState(undefined);
    const [enterUsernameMsg, setEnterUsernameMsg] = useState(
      'Enter a username',
    );

    const captureUsername = async () => {
      if (!usernameQueued) {
        alert(enterUsernameMsg);
        setEnterUsernameMsg(
          'Seriously, just type in the box and put some letters in.',
        );
        return;
      }
      if (!user.displayName) {
        var usernameRegex = /^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/gi;
        if (!usernameRegex.test(usernameQueued)) {
          const hint =
            usernameQueued.indexOf(' ') !== -1
              ? ' (try without spaces)'
              : '(invalid name)';
          if (usernameQueued.length < 10) {
            alert(
              `We're not letting "${usernameQueued}" join the platform...${hint}`,
            );
          } else {
            alert(
              `I don't know how to break it to you, but you're not getting in with a username like that.${hint}`,
            );
          }
          return;
        }
        if (
          [
            'Callum',
            'Connor',
            'Kaijai',
            'alex',
            'andrew',
            'megangreb',
            'stephanie',
          ].indexOf(usernameQueued) !== -1
        ) {
          alert("That name's taken. Try being original maybe?");
          return;
        }

        await user.updateProfile({ displayName: usernameQueued });
        await user.reload();
      }
    };

    // React.useEffect(
    //   () =>
    //     (async () => {
    //       await messaging().registerForRemoteNotifications();

    //       // ask for push notification permission
    //       await messaging().requestPermission();
    //     })(),
    //   [],
    // );

    return user.displayName ? (
      <AppNavigator />
    ) : (
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
          Let's see if you can figure out where to go from here.
        </Text>
        <View
          style={{ width: '100%', marginBottom: 50, paddingHorizontal: 40 }}
        >
          <TextInput
            autoFocus
            autoCapitalize={'none'}
            autoCorrect={false}
            autoCompleteType={'username'}
            returnKeyType={'go'}
            onChangeText={setUsernameQueued}
            value={usernameQueued}
            onSubmitEditing={captureUsername}
            placeholder="reserve a name"
          />
        </View>
        <Button
          onPress={captureUsername}
          bgColor={colors.white}
          textColor="white"
          caption="Let's go"
          bordered={true}
        />
      </View>
    );
  };

  return (
    <AuthNContext.Provider value={user}>
      <Startup />
    </AuthNContext.Provider>
  );
}
