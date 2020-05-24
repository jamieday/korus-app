/* eslint-disable no-shadow */
/* eslint-disable no-console */
/* eslint-disable no-undef */
/* eslint-disable import/prefer-default-export */
import React, { useState } from 'react';
import { View, Text, Button, ActivityIndicator } from 'react-native';
import { TextInput } from '../../components/TextInput';
import { colors } from '../../styles';
import { ValidUserView } from './ValidUserView';
import { useApi, useAuthN } from '../api';

export const SignedInView = () => {
  const { user } = useAuthN();
  const api = useApi();
  const [usernameQueued, setUsernameQueued] = useState(undefined);
  const [enterUsernameMsg, setEnterUsernameMsg] = useState('Enter a username');
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState();

  if (!user) {
    throw new Error('Must have a user account to reach this view.');
  }

  const captureUsername = async () => {
    if (user.displayName) {
      return;
    }

    if (!usernameQueued) {
      setError(enterUsernameMsg);
      setEnterUsernameMsg(
        'Seriously, just type in the box and put some letters in.',
      );
      return;
    }

    setLoading(true);
    const [_, error] = await api.post(
      `/user/${encodeURIComponent(user.uid)}/register`,
      {
        username: usernameQueued,
      },
    );
    setLoading(false);
    if (error) {
      setError(error);
      return;
    }
    setError(undefined);
    await user.reload();
  };

  return user.displayName ? (
    <ValidUserView />
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
          disabled={isLoading}
          error={error}
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
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <Button onPress={captureUsername} title="Let's go" />
      )}
    </View>
  );
};
