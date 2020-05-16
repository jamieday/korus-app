/* eslint-disable react/jsx-curly-newline */
/* eslint-disable no-console */
/* eslint-disable no-shadow */
/* eslint-disable import/prefer-default-export */
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { colors } from '../../styles';
import { SelectionList } from '../../components/SelectionList';
import FollowIcon from '../../../assets/images/icons/follow.svg';
import SelectedIcon from '../../../assets/images/icons/selected.svg';
import { useApi } from '../api';
import analytics from '@react-native-firebase/analytics';
import { List } from 'immutable';

export const GroupsScreen = () => {
  const api = useApi();
  const [isLoading, setLoading] = React.useState(false);
  const [users, setUsers] = React.useState(List());

  const refresh = async () => {
    console.debug('Fetch users to follow...');
    setLoading(true);
    const [usersR, error] = await api.get('/people/users/all');
    const users = List(error ? [] : usersR);
    console.debug(`Fetched ${users.size} users.`);
    setUsers(users);
    setLoading(false);
  };

  React.useEffect(() => {
    refresh();
  }, []);

  return (
    <View style={styles.container}>
      <SelectionList
        refreshing={isLoading}
        onRefresh={refresh}
        keyExtractor={(user) => user.username}
        items={users.sort((a, b) => a.username > b.username).toArray()}
        getItemDetail={(user) => ({ title: user.username })}
        actionIcon={(user) =>
          user.isFollowed ? (
            <SelectedIcon width={20} height={20} fill={colors.white} />
          ) : (
            <FollowIcon width={20} height={20} fill={colors.white} />
          )
        }
        onItemPressed={async (targetUser) => {
          setUsers(
            users.map((user) =>
              user.username === targetUser.username
                ? { ...targetUser, isFollowed: !targetUser.isFollowed }
                : user,
            ),
          );

          if (!targetUser.isFollowed) {
            await api.followUser(targetUser.username);
          } else {
            await api.unfollowUser(targetUser.username);
          }
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
});
