import React from 'react';
import { StyleSheet, View } from 'react-native';
import { colors } from '../../styles';
import { SelectionList } from '../../components/SelectionList';
import FollowIcon from '../../../assets/images/icons/follow.svg';
import UnfollowIcon from '../../../assets/images/icons/unfollow.svg';
import { API_HOSTNAME } from '../discover/DiscoverScreen';
import { getUsername } from '../identity/getUsername';

export const GroupsScreen = () => {
  const [users, setUsers] = React.useState([]);

  React.useEffect(() => {
    (async () => {
      console.log('Fetch users to follow...');

      const chorusUserToken = await getUsername();
      if (!chorusUserToken) {
        console.log('User not signed in??');
        return;
      }

      const users = await (
        await fetch(`http://${API_HOSTNAME}/api/users/follow-bulk/list`, {
          headers: {
            // Header duplicated in backend {7d25eb5a-2c5a-431b-95a8-14f980c8f7e1}
            'X-Chorus-User-Token': chorusUserToken,
          },
        })
      ).json();
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
            <UnfollowIcon width={20} height={20} fill={colors.white} />
          ) : (
            <FollowIcon width={20} height={20} fill={colors.white} />
          )
        }
        onItemPressed={async user => {
          const chorusUserToken = await getUsername();
          if (!chorusUserToken) {
            console.log('User not signed in??');
            return;
          }

          console.log(
            `${user.isFollowed ? 'Unfollowed' : 'Followed'} ${user.username}.`,
          );

          setUsers([
            ...users.filter(one => one.username != user.username),
            { ...user, isFollowed: !user.isFollowed },
          ]);

          await fetch(
            `http://${API_HOSTNAME}/api/users${
              user.isFollowed ? '/unfollow' : '/follow'
            }`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',

                // Header duplicated in backend {7d25eb5a-2c5a-431b-95a8-14f980c8f7e1}
                'X-Chorus-User-Token': chorusUserToken,
              },
              body: JSON.stringify({
                targetUsername: user.username,
              }),
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
    backgroundColor: colors.lightBlack,
  },
});
