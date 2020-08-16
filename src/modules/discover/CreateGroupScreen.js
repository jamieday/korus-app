import {
  ActionSheetIOS,
  ActivityIndicator,
  Button,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { colors } from '../../styles';
import PlusIcon from '../../../assets/images/icons/plus-simple.svg';
import React, { useEffect, useState } from 'react';
import { TextInput } from '../../korui/TextInput';
import { SectionHeader } from '../../korui/SectionHeader';
import GroupsIcon from '../../../assets/images/icons/groups.svg';
import { MultiselectList } from '../../korui/form/MultiselectList';
import Image from 'react-native-fast-image';
import { Set, Map } from 'immutable';
import ImagePicker from 'react-native-image-picker';
import { CircleView } from '../../korui/layout/CircleView';
import { useApi } from '../api';
import { getFallbackProfileImageSource } from '../activity/ActivityScreen';
import { queryCache } from 'react-query';

export const CreateGroupScreen = ({ navigation }) => {
  const api = useApi();
  const [error, setError] = useState();
  const [users, setUsers] = useState([]);
  const [isLoading, setLoading] = useState(false);

  const [groupName, setGroupName] = useState('');
  const [profilePicDataUri, setProfilePicDataUri] = useState();
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

  const selectProfilePic = () => {
    ImagePicker.showImagePicker(
      { mediaType: 'photo', maxWidth: 1024, maxHeight: 1024, quality: 0.2 },
      (response) => {
        if (response.data) {
          setProfilePicDataUri(`data:image/jpeg;base64,${response.data}`);
        }
      },
    );
  };

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
        {profilePicDataUri ? (
          <TouchableOpacity
            onPress={() => {
              const options = ['Replace photo...', 'Remove photo', 'Cancel'];
              ActionSheetIOS.showActionSheetWithOptions(
                {
                  options,
                  cancelButtonIndex: options.indexOf('Cancel'),
                  destructiveButtonIndex: options.indexOf('Remove photo'),
                },
                (selectedIndex) => {
                  switch (selectedIndex) {
                    case 0:
                      selectProfilePic();
                      break;
                    case 1:
                      setProfilePicDataUri(undefined);
                      break;
                  }
                },
              );
            }}
          >
            <Image
              style={{ width: 44, aspectRatio: 1 }}
              source={{ uri: profilePicDataUri }}
              borderRadius={44 / 2}
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => {
              selectProfilePic();
            }}
          >
            <CircleView fill={colors.gray} size={44}>
              <PlusIcon width={20} height={20} fill={colors.darkGray} />
            </CircleView>
          </TouchableOpacity>
        )}
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
