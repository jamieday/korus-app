import React from 'react';
import { StyleSheet, View } from 'react-native';
import { colors } from '../../styles';
import { SelectionList } from '../../components/SelectionList';
import FollowIcon from '../../../assets/images/icons/follow.svg';
import SelectedIcon from '../../../assets/images/icons/selected.svg';
import { getUsername } from '../identity/getUsername';
import { api } from '../api/callApi';

export const GroupsScreen = () => {
  const [users, setUsers] = React.useState([]);

  React.useEffect(() => {
    (async () => {
      console.log('Fetch users to follow...');
      const [users] = await api().get('/users/follow-bulk/list');
      console.log(`Fetched ${users.length} users.`);
      setUsers(users);
    })();
  }, []);

  return (
    <View style={styles.container}>
      <SelectionList
        keyExtractor={user => user.username}
        items={users.sort((a, b) => a.username > b.username)}
        getItemDetail={user => ({ title: user.username })}
        actionIcon={user =>
          user.isFollowed ? (
            <SelectedIcon width={20} height={20} fill={colors.white} />
          ) : (
            <FollowIcon width={20} height={20} fill={colors.white} />
          )
        }
        onItemPressed={async user => {
          const chorusUserToken = getUsername();
          if (!chorusUserToken) {
            console.log('User not signed in??');
            return;
          }

          setUsers([
            ...users.filter(one => one.username != user.username),
            { ...user, isFollowed: !user.isFollowed },
          ]);

          await api().post(
            `/users${user.isFollowed ? '/unfollow' : '/follow'}`,
            {
              targetUsername: user.username,
            },
          );
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
