import React from 'react';
import { Button, View } from 'react-native';
import auth from '@react-native-firebase/auth';

export function DevSignIn() {
  if (!__DEV__) {
    return null;
  }

  const signIn = async () => {
    const confirmation = await auth().signInWithPhoneNumber('+1 555-555-5555');
    await confirmation.confirm('123456');
  };

  return (
    <View style={{ position: 'absolute', top: -215, left: 121 }}>
      <Button title="." onPress={() => signIn()} />
    </View>
  );
}
