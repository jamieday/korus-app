/* eslint-disable import/prefer-default-export */
import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { colors } from '../styles';

export const StartupProgress = () => {
  return (
    <View
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        backgroundColor: colors.black,
      }}
    >
      <ActivityIndicator />
    </View>
  );
};
