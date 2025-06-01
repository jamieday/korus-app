import { ImageStyle, StyleProp, View } from 'react-native';
import React, { ReactNode } from 'react';

interface CircleViewProps {
  style?: StyleProp<any>;
  fill: string;
  children?: ReactNode;
  size: number;
}

export const CircleView = ({
  style,
  fill,
  children,
  size
}: CircleViewProps) => (
  <View
    style={[
      {
        backgroundColor: fill,
        width: size,
        aspectRatio: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: size / 2
      },
      style
    ]}
  >
    {children}
  </View>
);
