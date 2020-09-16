import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { colors } from '../../styles';
import { formatCount } from '../profile/formatCount';
import { useQuery } from 'react-query';
import { toQuery, useApi } from '../api';
import { SharesScreen } from './SharesScreen';

export const UserSharesScreen = ({ navigation, route }) => {
  const profile = route.params.profile;

  return (
    <SharesScreen
      scope={{ type: 'by-user', id: profile.userId }}
      scrollToShareId={route.params.scrollToShareId}
      navigation={navigation}
      route={route}
      title={profile.username}
      imageSource={
        profile.profilePicUrl
          ? { uri: profile.profilePicUrl }
          : require('../../../assets/images/default-profile.png')
      }
    />
  );
};
