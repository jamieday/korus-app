import { Text, View } from 'react-native';
import { colors } from '../../styles';
import React from 'react';

export const SongTextOverlay = ({ children }) => (
  <View
    style={{
      backgroundColor: '#000000a0',
      borderRadius: 5,
      padding: 5,
    }}
  >
    <Text
      style={{
        color: colors.white,
        fontSize: 14,
        textShadowColor: 'black',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 2,
      }}
    >
      {children}
    </Text>
  </View>
);
