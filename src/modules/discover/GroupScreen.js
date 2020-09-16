import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { colors } from '../../styles';
import { formatCount } from '../profile/formatCount';
import { useQuery } from 'react-query';
import { toQuery, useApi } from '../api';
import { SharesScreen } from './SharesScreen';

const useGroupDetails = (groupId) => {
  const api = useApi();
  const { data: group, error, status, refetch } = useQuery(
    ['group-summary', groupId],
    toQuery(() => api.getGroupSummary(groupId)),
  );

  return {
    data: group,
    status,
    error,
    refetch,
  };
};

export const GroupScreen = ({ navigation, route }) => {
  const groupId = route.params.id;
  const { data: group } = useGroupDetails(groupId);

  if (!group) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.lightBlack }}>
        <ActivityIndicator style={{ marginTop: 15 }} />
      </View>
    );
  }
  return (
    <SharesScreen
      // For now to avoid nav complexity
      hasNavigationHeader={true}
      scope={{ type: 'group', id: groupId }}
      navigation={navigation}
      route={route}
      title={group.name}
      imageSource={{ uri: group.profilePicUrl }}
      description={`${formatCount(group.members.length)} members`}
    />
  );
};
