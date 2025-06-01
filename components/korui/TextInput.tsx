import React, { forwardRef } from 'react';
import {
  TextInput as RNTextInput,
  View,
  Text,
  TextInputProps,
  StyleProp,
  ViewStyle
} from 'react-native';
import { colors } from '@/styles';

interface TextInputComponentProps extends TextInputProps {
  error?: string;
  characterLimit?: number;
}

export const TextInput = forwardRef<RNTextInput, TextInputComponentProps>(
  ({ style, error, characterLimit, ...otherProps }, ref) => {
    const charactersRemaining =
      characterLimit && otherProps.value
        ? characterLimit - otherProps.value.length
        : undefined;

    return (
      <View>
        <RNTextInput
          ref={ref}
          selectionColor={colors.darkLightGray}
          style={[
            {
              backgroundColor: colors.darkGray,
              color: colors.white,
              borderRadius: 6,
              padding: 15
            },
            error && {
              borderStyle: 'solid',
              borderWidth: 2,
              borderColor: colors.danger
            },
            style
          ]}
          placeholderTextColor={colors.gray}
          {...otherProps}
        />
        {error ? (
          <Text
            style={{
              fontSize: 12,
              marginTop: 8,
              paddingHorizontal: 5,
              color: colors.danger
            }}
          >
            {error}
          </Text>
        ) : (
          characterLimit &&
          charactersRemaining !== undefined && (
            <Text
              style={{
                bottom: 0,
                fontSize: 12,
                marginTop: 8,
                paddingHorizontal: 5,
                color: charactersRemaining < 0 ? colors.danger : colors.gray
              }}
            >
              {charactersRemaining} characters remaining
            </Text>
          )
        )}
      </View>
    );
  }
);
