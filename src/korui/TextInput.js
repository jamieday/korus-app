import React from 'react';
import { TextInput as RNTextInput, View, Text } from 'react-native';
import { colors } from '../styles';

export const TextInput = ({ style, error, characterLimit, ...otherProps }) => {
  const charactersRemaining =
    characterLimit && characterLimit - otherProps.value.length;

  return (
    <View>
      <RNTextInput
        style={[
          {
            backgroundColor: colors.darkGray,
            color: colors.white,
            borderRadius: 6,
            padding: 15,
          },
          error && {
            borderStyle: 'solid',
            borderWidth: 2,
            borderColor: colors.danger,
          },
          style,
        ]}
        placeholderTextColor={colors.gray}
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...otherProps}
      />
      {error ? (
        <Text
          style={{
            fontSize: 12,
            marginTop: 8,
            paddingHorizontal: 5,
            color: colors.danger,
          }}
        >
          {error}
        </Text>
      ) : (
        characterLimit && (
          <Text
            style={{
              fontSize: 12,
              marginTop: 8,
              paddingHorizontal: 5,
              color: charactersRemaining < 0 ? colors.danger : colors.gray,
            }}
          >
            {charactersRemaining} characters remaining
          </Text>
        )
      )}
    </View>
  );
};
