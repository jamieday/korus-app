import { Text } from 'react-native';
import React from 'react';
import { colors } from '../styles';

export const SectionHeader = ({ children }) => (
  <Text
    style={{
      color: colors.white,
      fontWeight: 'bold',
      fontSize: 15,
    }}
  >
    {children}
  </Text>
);
