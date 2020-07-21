import React from 'react';
import { View } from 'react-native';
import { List } from 'immutable';
import { colors } from '../../styles';
import { SelectionList } from '../../korui/selection/SelectionList';
import NextIcon from '../../../assets/images/icons/next.svg';
import { useApi } from '../api';

export const PeopleScreen = ({ navigation }) => {
  const api = useApi();
  const [isLoading, setLoading] = React.useState(false);
  const [users, setUsers] = React.useState(List());

  const refresh = async () => {
    console.debug('Fetch users to follow...');
    setLoading(true);
    const [usersR, error] = await api.listUsers();
    const users = List(error ? [] : usersR);
    console.debug(`Fetched ${users.size} users.`);
    setUsers(users);
    setLoading(false);
  };

  React.useEffect(() => {
    refresh();
  }, []);

  return (
    <View
      style={{
        backgroundColor: colors.lightBlack,
        flex: 1,
      }}
    >
      <View>
        <SelectionList
          style={{
            paddingHorizontal: 30,
          }}
          refreshing={isLoading}
          onRefresh={refresh}
          keyExtractor={(user) => user.id}
          items={users.toArray()}
          getItemDetail={(user) => ({ title: user.username })}
          actionIcon={(user) => (
            <NextIcon width={20} height={20} fill={colors.white} />
          )}
          onItemPressed={async (targetUser) => {
            setUsers(
              users.map((user) =>
                user.username === targetUser.username
                  ? { ...targetUser, isFollowed: !targetUser.isFollowed }
                  : user,
              ),
            );

            navigation.push('Profile', { id: targetUser.id });
          }}
        />
      </View>
    </View>
  );
};
