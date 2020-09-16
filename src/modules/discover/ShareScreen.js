import React from 'react';
import { View } from 'react-native';
import { colors } from '../../styles';
import { SharedSong } from './SharedSong';

export const ShareScreen = ({ share, navigation }) => {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.lightBlack,
      }}
    >
      <SharedSong
        navigation={navigation}
        didUnshare={() => navigation.goBack()}
        share={share}
      />
    </View>
  );
};
