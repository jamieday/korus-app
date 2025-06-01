import { View, Text } from 'react-native';
import React from 'react';
import { colors } from '../styles';

export const SectionHeader = ({ Icon, children, style }) => (
  <View style={[{ flexDirection: 'row', alignItems: 'center' }, style]}>
    {Icon && (
      <Icon
        style={{ marginRight: 5 }}
        width={25}
        height={25}
        fill={colors.white}
      />
    )}
    <Text
      style={{
        color: colors.white,
        fontWeight: 'bold',
        fontSize: 15,
      }}
    >
      {children}
    </Text>
  </View>
);
