import React from 'react';
import { SharesFeed } from './SharesFeed';
import { View } from 'react-native';
import { colors } from '../../styles';

export const GroupScreen = ({ navigation, route }) => {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.lightBlack,
      }}
    >
      <SharesFeed
        scope={{ type: 'group', id: route.params.id }}
        navigation={navigation}
        route={route}
      />
    </View>
  );
};
