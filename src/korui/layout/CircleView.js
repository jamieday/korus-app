import { View } from 'react-native';
import React from 'react';

export const CircleView = ({ fill, children, size }) => (
  <View
    style={{
      backgroundColor: fill,
      width: size,
      aspectRatio: 1,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: size / 2,
    }}
  >
    {children}
  </View>
);
