import React from 'react';
import { View } from 'react-native';
import { List } from 'immutable';
import { colors } from '../../styles';
import { SelectionList } from '../../korui/selection/SelectionList';
import NextIcon from '../../../assets/images/icons/next.svg';
import { useApi } from '../api';
import { TextInput } from '../../korui/TextInput';

export const PeopleScreen = ({ navigation }) => {
  const api = useApi();
  const [isLoading, setLoading] = React.useState(false);
  const [users, setUsers] = React.useState(List());
  const [listedUsers, setListedUsers] = React.useState(List());

  const [searchQuery, setSearchQuery] = React.useState('');
  React.useEffect(() => {
    setListedUsers(
      users.filter(
        (user) =>
          user.username
            .toLowerCase()
            .indexOf(searchQuery.trim().toLowerCase()) !== -1,
      ),
    );
  }, [users, searchQuery]);

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
        <TextInput
          style={{
            margin: 12,
          }}
          autoFocus
          autoCorrect={false}
          placeholder="Search for ppl.."
          onChangeText={setSearchQuery}
          value={searchQuery}
          clearButtonMode={'always'}
        />
        <SelectionList
          style={{
            paddingHorizontal: 30,
          }}
          refreshing={isLoading}
          onRefresh={refresh}
          keyExtractor={(user) => user.id}
          items={listedUsers.toArray()}
          getItemDetail={(user) => ({ title: user.username })}
          actionIcon={() => (
            <NextIcon width={20} height={20} fill={colors.white} />
          )}
          onItemPressed={async (targetUser) => {
            navigation.navigate('Profile', {
              id: targetUser.id,
            });
          }}
        />
      </View>
    </View>
  );
};
