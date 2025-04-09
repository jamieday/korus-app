import React from 'react';
import { Button, View, Alert } from 'react-native';
import auth from '@react-native-firebase/auth';

export function DevSignIn() {
  if (!__DEV__) {
    return null;
  }

  const signIn = async () => {
    try {
      console.log('Starting dev sign in...');
      console.log('Firebase auth state:', auth().app.options);
      
      console.log('Attempting to send verification code...');
      const phoneNumber = '+15555555555'; // Remove spaces for consistency
      const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
      console.log('Verification code sent successfully');
      
      console.log('Attempting to confirm code...');
      await confirmation.confirm('123456');
      console.log('Dev sign in successful');
    } catch (error) {
      console.error('Dev sign in error:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      console.error('Full error:', JSON.stringify(error, null, 2));
      
      Alert.alert(
        'Dev Sign In Error',
        `${error.code}: ${error.message}\n\nCheck console for details.`
      );
    }
  };

  return (
    <View>
      <View style={{ position: 'absolute', top: -215, left: 121 }}>
        <Button title="dev" onPress={() => signIn()} />
      </View>
    </View>
  );
}
