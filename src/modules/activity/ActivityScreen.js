import React, { useCallback, useState } from 'react';
import Image from 'react-native-fast-image';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { useScrollToTop } from '@react-navigation/native';
import { useQuery } from 'react-query';
import { intervalToDuration, parseISO } from 'date-fns';
import { colors } from '../../styles';
import { ErrorView } from '../error/ErrorView';
import { toQuery, useApi } from '../api';

const formatOccurredAt = (occurredAt) => {
  const duration = intervalToDuration({
    start: parseISO(occurredAt),
    end: new Date(),
  });

  const durationFormat = [
    ['years', 'y'],
    ['weeks', 'w'],
    ['days', 'd'],
    ['hours', 'h'],
    ['minutes', 'm'],
    ['seconds', 's'],
  ];

  for (const [prop, indicator] of durationFormat) {
    if (duration[prop] > 0) {
      return `${duration[prop]}${indicator}`;
    }
  }

  return 'just now';
};
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const ActivityScreen = ({ navigation }) => {
  const api = useApi();

  const { data: activity, error, status, refetch } = useQuery(
    'my-activity',
    toQuery(api.getMyActivity),
    {
      // can use firebase messaging on reception of notifications rather than polling
      refetchInterval: 10000,
      refetchOnWindowFocus: true,
    },
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

  const renderItem = useCallback(
    ({ item: userEvent }) => (
      <UserEvent
        style={{ marginBottom: 10 }}
        userEvent={userEvent}
        navigation={navigation}
      />
    ),
    [navigation],
  );

  const listRef = React.useRef();

  useScrollToTop(listRef);

  if (status === 'loading') {
    return (
      <View
        style={{ backgroundColor: colors.lightBlack, flex: 1, padding: 20 }}
      >
        <ActivityIndicator />
      </View>
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

  const { events } = activity;

  if (events.length === 0) {
    return (
      <View
        style={{
          backgroundColor: colors.lightBlack,
          flex: 1,
          padding: 20,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text
          style={{
            color: colors.white,
            textAlign: 'center',
            fontWeight: 'bold',
            fontSize: 20,
          }}
        >
          This is where you'll find your notifications & activity.
        </Text>
      </View>
    );
  }

  return (
    <View
      style={{
        backgroundColor: colors.lightBlack,
        flex: 1,
      }}
    >
      <FlatList
        ref={listRef}
        onRefresh={refresh}
        refreshing={isRefreshing}
        keyExtractor={keyExtractor}
        style={{
          backgroundColor: colors.lightBlack,
          padding: 15,
        }}
        data={events}
        renderItem={renderItem}
      />
    </View>
  );
};

const keyExtractor = ({ id }) => id;

// -----FUNNY---------FUNNY---------FUNNY---------FUNNY---------FUNNY---------FUNNY----
const funny = [
  require('../../../assets/images/funny-1.jpg'),
  require('../../../assets/images/funny-2.jpg'),
  require('../../../assets/images/funny-3.jpg'),
  require('../../../assets/images/funny-4.jpg'),
  require('../../../assets/images/funny-5.gif'),
  require('../../../assets/images/funny-6.png'),
];
const hashCode = (str) => {
  let hash = 0,
    i,
    chr;
  for (i = 0; i < str.length; i++) {
    chr = str.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};
const getFallbackProfileImageSource = (userId) => {
  return funny[Math.abs(hashCode(userId) % funny.length)];
};
// -----FUNNY---------FUNNY---------FUNNY---------FUNNY---------FUNNY---------FUNNY----

const UserEvent = ({ navigation, style, userEvent }) => {
  return (
    <View style={style}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          height: 55,
        }}
      >
        <TouchableOpacity
          style={{ padding: 5 }}
          activeOpacity={0.75}
          onPress={() =>
            navigation.push('Profile', { id: userEvent.actor.userId })
          }
        >
          <Image
            resizeMode="cover"
            source={
              userEvent.actor.profilePicUrl
                ? {
                    uri: userEvent.actor.profilePicUrl,
                  }
                : getFallbackProfileImageSource(userEvent.actor.userId)
            }
            style={{
              borderColor: colors.white,
              borderWidth: 1.2,
              marginRight: 5,
              height: '100%',
              aspectRatio: 1,
              borderRadius: 22,
            }}
          />
        </TouchableOpacity>
        <Text
          style={{
            color: colors.white,
            fontSize: 12,
            fontWeight: 'bold',
            flexGrow: 1,
            flexShrink: 1,
          }}
        >
          {userEvent.description}
          <Text
            style={{
              color: colors.darkLightGray,
              fontSize: 12,
              fontWeight: 'normal',
            }}
          >
            {' '}
            {formatOccurredAt(userEvent.occurredAt)}
          </Text>
        </Text>
        {userEvent.relatedImageUrl && (
          <Image
            resizeMode="cover"
            source={{ uri: userEvent.relatedImageUrl }}
            style={{
              height: '100%',
              aspectRatio: 1,
              alignSelf: 'flex-end',
              borderRadius: 7,
              marginLeft: 10,
            }}
          />
        )}
      </View>
    </View>
  );
};
