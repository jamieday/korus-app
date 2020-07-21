import {
  ActivityIndicator,
  Button,
  FlatList,
  ImageBackground,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { colors } from '../../styles';
import Image from 'react-native-fast-image';
import React, { useCallback, useState } from 'react';
import AddIcon from '../../../assets/images/icons/plus-simple.svg';
import LinearGradient from 'react-native-linear-gradient';
import { formatCount } from '../profile/formatCount';
import { useQuery } from 'react-query';
import { toQuery, useApi } from '../api';
import { ErrorView } from '../error/ErrorView';

const Container = ({ children }) => (
  <View style={{ flex: 1, backgroundColor: colors.lightBlack }}>
    <View style={{ padding: 16 }}>{children}</View>
  </View>
);
export const MyGroupsScreen = ({ navigation }) => {
  const api = useApi();
  const { data: groups, error, status, refetch } = useQuery(
    'my-groups',
    toQuery(api.listMyGroups),
  );

  // very duplicated with activity view 1B41B39B-3379-4399-B95C-F70FC7D113B5
  const sleep = useCallback(
    (ms) => new Promise((resolve) => setTimeout(resolve, ms)),
    [],
  );
  const [isRefreshing, setRefreshing] = useState(false);
  const refresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([refetch(), sleep(450)]);
    } finally {
      setRefreshing(false);
    }
  };

  if (status === 'loading') {
    return (
      <Container>
        <ActivityIndicator />
      </Container>
    );
  }

  if (error) {
    return (
      <ErrorView
        error={error.message}
        refresh={refresh}
        isRefreshing={isRefreshing}
      />
    );
  }

  if (groups.length === 0) {
    return (
      <Container>
        <NoGroupsYet />
      </Container>
    );
  }

  return (
    <Container>
      <TouchableOpacity
        onPress={() => {
          navigation.push('Create new group');
        }}
        activeOpacity={0.7}
      >
        <View
          style={{
            flexDirection: 'row',
            padding: 10,
            height: 43,
            alignItems: 'center',
            backgroundColor: colors.darkGray,
            borderRadius: 10,
          }}
        >
          <Text
            style={{
              flex: 1,
              color: colors.lightGray,
              textTransform: 'uppercase',
            }}
          >
            Create new group...
          </Text>
          <AddIcon width={25} height={25} fill={colors.lightGray} />
        </View>
      </TouchableOpacity>
      <FlatList
        data={groups}
        showsVerticalScrollIndicator={false}
        renderItem={({ index, item: group }) => (
          <TouchableOpacity
            key={group.id}
            activeOpacity={0.5}
            style={[
              ...(index < groups.length - 1
                ? []
                : [
                    {
                      marginBottom: 50,
                    },
                  ]),
            ]}
            onPress={() => {
              navigation.push('Group', { id: group.id });
            }}
          >
            <ImageBackground
              resizeMode="cover"
              source={group.profilePicUrl ? { uri: group.profilePicUrl } : []}
              style={{
                height: 86,
                marginTop: 20,
                backgroundColor: colors.darkGray,
                borderRadius: 15,
              }}
              width={20}
              borderRadius={20}
            >
              <LinearGradient
                locations={[0, 1]}
                style={[{ height: '100%', padding: 10, borderRadius: 15 }]}
                colors={['#000000FF', '#00000044']}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <View>
                      <Text
                        style={{
                          color: colors.darkLightGray,
                          textTransform: 'uppercase',
                          fontSize: 12,
                        }}
                        numberOfLines={1}
                      >
                        {formatCount(group.numMembers)} members
                      </Text>
                    </View>
                    <View>
                      <Text
                        numberOfLines={1}
                        style={{ color: colors.white, fontSize: 21 }}
                      >
                        {group.name}
                      </Text>
                    </View>
                  </View>
                  {group.profilePicUrl && (
                    <View>
                      <Image
                        style={{ width: 50, aspectRatio: 1, borderRadius: 25 }}
                        source={{ uri: group.profilePicUrl }}
                      />
                    </View>
                  )}
                </View>
              </LinearGradient>
            </ImageBackground>
          </TouchableOpacity>
        )}
      />
    </Container>
  );
};

const NoGroupsYet = () => (
  <View
    style={{
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
    }}
  >
    <Image
      source={require('../../../assets/images/squad.png')}
      resizeMode={'cover'}
      style={{
        width: 300,
        maxWidth: '100%',
        aspectRatio: 1.4,
        borderRadius: 25,
        marginBottom: 5,
      }}
    />
    <Text
      style={{
        color: colors.lightGray,
        fontSize: 14,
        paddingHorizontal: 20,
        marginBottom: 30,

        textAlign: 'center',
      }}
    >
      Get the squad together.
    </Text>
    <Button
      title="Create a group"
      onPress={() => {
        alert('hi');
      }}
    />
  </View>
);
