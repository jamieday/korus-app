/* eslint-disable no-shadow */
/* eslint-disable no-console */
/* eslint-disable no-undef */
/* eslint-disable no-alert */
/* eslint-disable import/prefer-default-export */
import React, { useState } from 'react';
import { View, Text } from 'react-native';
import AppNavigator from './RootNavigation';
import { colors } from '../../styles';
import { Button, TextInput } from '../../components';
import { appleMusicApi } from '../../react-native-apple-music/io/appleMusicApi';
import { useAuthN } from '../api';
import { AppleMusicContext } from '../auth';

export const SignedInView = () => {
  const { user } = useAuthN();
  const [usernameQueued, setUsernameQueued] = useState(undefined);
  const [enterUsernameMsg, setEnterUsernameMsg] = useState('Enter a username');

  if (!user) {
    throw new Error('Must have a user account to reach this view.');
  }

  const captureUsername = async () => {
    if (!usernameQueued) {
      alert(enterUsernameMsg);
      setEnterUsernameMsg(
        'Seriously, just type in the box and put some letters in.',
      );
      return;
    }
    if (!user.displayName) {
      const usernameRegex = /^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/gi;
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

      await (async () => {
        await user.updateProfile({ displayName: usernameQueued });
        await user.reload();
      })();
    }
  };

  const ConfirmedUserView = () => {
    const [appleMusicUserToken, setAppleMusicUserToken] = useState();

    React.useEffect(() => {
      (async () => {
        await appleMusicApi.requestPermission();
        const result = await appleMusicApi.requestUserToken();
        const appleMusicUserToken = !result.isError ? result.result : undefined;
        setAppleMusicUserToken(appleMusicUserToken);
      })();
    }, []);

    if (!appleMusicUserToken) {
      return (
        <View style={{ height: '100%', backgroundColor: colors.lightBlack }} />
      );
    }

    return (
      <AppleMusicContext.Provider value={appleMusicUserToken}>
        <AppNavigator />
      </AppleMusicContext.Provider>
    );
  };

  return user.displayName ? (
    <ConfirmedUserView />
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
        Let&apos;s see if you can figure out where to go from here.
      </Text>
      <View style={{ width: '100%', marginBottom: 50, paddingHorizontal: 40 }}>
        <TextInput
          autoFocus
          autoCapitalize="none"
          autoCorrect={false}
          autoCompleteType="username"
          returnKeyType="go"
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
        bordered
      />
    </View>
  );
};
