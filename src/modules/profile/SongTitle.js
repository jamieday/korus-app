import { Text, View } from 'react-native';
import React from 'react';
import { colors } from '../../styles';

export const SongTitle = ({ style, songName, artistName, size = 'normal' }) => {
  return (
    <View style={style}>
      <Text
        style={{
          color: colors.lightGray,
          fontSize:
            size === 'normal'
              ? 14
              : size === 'small'
              ? 6
              : (() => {
                  throw new Error('size not supported');
                })(),
          textTransform: 'uppercase',
        }}
      >
        {artistName}
      </Text>
      <Text
        numberOfLines={1}
        style={[
          {
            color: colors.white,
            fontWeight: 'bold',
            fontSize:
              size === 'normal'
                ? 20
                : size === 'small'
                ? 9
                : (() => {
                    throw new Error('size not supported');
                  })(),
          },
          { marginBottom: 0 },
        ]}
      >
        {songName}
      </Text>
    </View>
  );
};
