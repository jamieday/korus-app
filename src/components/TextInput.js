import React from 'react';
import { TextInput as RNTextInput } from 'react-native';
import { colors } from '../styles';

export const TextInput = ({ style, ...otherProps }) => {
  return (
    <RNTextInput
      style={[
        {
          backgroundColor: colors.lightGray,
          color: colors.black,
          borderRadius: 6,
          padding: 15,
        },
        style,
      ]}
      placeholderTextColor={colors.gray}
      {...otherProps}
    />
  );
};
