import { ActivityIndicator, Button, Text, View } from 'react-native';
import { colors } from '../../styles';
import React, { useEffect, useState } from 'react';
import { TextInput } from '../../korui/TextInput';
import { SectionHeader } from '../../korui/SectionHeader';
import GroupsIcon from '../../../assets/images/icons/groups.svg';
import { MultiselectList } from '../../korui/form/MultiselectList';
import Image from 'react-native-fast-image';
import { Set } from 'immutable';
import { useApi } from '../api';
import { getFallbackProfileImageSource } from '../activity/ActivityScreen';
import { queryCache } from 'react-query';
import { ProfilePicSelector } from '../../korui/image/ProfilePicSelector';
import { useImagePicker } from '../../korui/image/useImagePicker';

export const CreateGroupScreen = ({ navigation }) => {
  const api = useApi();
  const [error, setError] = useState();
  const [users, setUsers] = useState([]);
  const [isLoading, setLoading] = useState(false);

  const [groupName, setGroupName] = useState('');
  const [memberUserIds, setMemberUserIds] = useState(new Set());

  const createGroup = async () => {
    setLoading(true);
    const [_, error] = await api.createGroup({
      name: groupName,
      profilePicDataUri,
      memberUserIds: [...memberUserIds.values()],
    });
    if (error) {
      setError(error);
      setLoading(false);
      return;
    }
    queryCache.invalidateQueries('my-groups');
    navigation.pop();
  };

  const {
    imageUri: profilePicDataUri,
    selectImage: selectProfilePic,
    clearImage: clearProfilePic,
  } = useImagePicker();

  useEffect(() => {
    (async () => {
      const [usersR, error] = await api.listUsers();
      if (error) {
        setError(error);
        return;
      }
      setUsers(usersR);
    })();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: colors.black }}>
      <View
        style={{
          padding: 20,

          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <ProfilePicSelector
          size={44}
          profilePicUri={profilePicDataUri}
          onSelectPhoto={selectProfilePic}
          onRemovePhoto={clearProfilePic}
        />
        <View style={{ flex: 1 }}>
          <TextInput
            error={error}
            value={groupName}
            onChangeText={setGroupName}
            placeholder="group name..."
            style={{
              fontSize: 16,
              backgroundColor: 'transparent',
              color: colors.lightGray,
            }}
          />
        </View>
        {isLoading ? (
          <ActivityIndicator />
        ) : (
          <Button
            title="Create"
            onPress={() => {
              createGroup();
            }}
            disabled={groupName.length === 0 || memberUserIds.size === 0}
            color={colors.turquoise}
          />
        )}
      </View>
      <View style={{ padding: 0, flex: 1, backgroundColor: colors.lightBlack }}>
        <MultiselectList
          striped
          ListHeaderComponent={() => (
            <View style={{ padding: 20 }}>
              <SectionHeader style={{ marginBottom: 0 }} Icon={GroupsIcon}>
                Add members
              </SectionHeader>
              {/*<TextInput*/}
              {/*  style={{ padding: 10, fontSize: 14, marginBottom: 5 }}*/}
              {/*  value={''}*/}
              {/*  placeholder={'Search friends...'}*/}
              {/*/>*/}
            </View>
          )}
          keyExtractor={({ id }) => id}
          onSelect={(user) => setMemberUserIds(memberUserIds.add(user.id))}
          onDeselect={(user) => setMemberUserIds(memberUserIds.remove(user.id))}
          items={users.map((user) => ({
            ...user,
            selected: memberUserIds.has(user.id),
          }))}
          renderItem={({ item: { id, profilePicUrl, username } }) => {
            return (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ marginRight: 8 }}>
                  <Image
                    style={{ width: 25, aspectRatio: 1 }}
                    source={
                      profilePicUrl
                        ? { uri: profilePicUrl }
                        : getFallbackProfileImageSource(id)
                    }
                    borderRadius={12.5}
                  />
                </View>
                <Text style={{ color: colors.white }}>{username}</Text>
              </View>
            );
          }}
        />
      </View>
    </View>
  );
};
