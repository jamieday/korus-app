import React, { useMemo, useState } from 'react';
import { SharesFeed } from './SharesFeed';
import {
  ActivityIndicator,
  Animated,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { colors } from '../../styles';
import { Image } from '../../korui/Image';
import { formatCount } from '../profile/formatCount';
import BackIcon from '../../../assets/images/icons/back.svg';
import { useQuery } from 'react-query';
import { toQuery, useApi } from '../api';

const useGroupDetails = (groupId) => {
  const api = useApi();
  const { data: groups, error, status, refetch } = useQuery(
    'my-groups',
    toQuery(api.listMyGroups),
  );

  const group = useMemo(() => {
    const candidates = groups.filter((group) => group.id === groupId);
    return candidates.length === 1 ? candidates[0] : undefined;
  }, [groups]);

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

  const [y, _] = useState(new Animated.Value(0));

  if (!group) {
    return <ActivityIndicator />;
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.lightBlack,
      }}
    >
      <SharesFeed
        style={{
          position: 'absolute',
          paddingTop: HEADER_HEIGHT,
          width: '100%',
        }}
        scope={{ type: 'group', id: groupId }}
        navigation={navigation}
        route={route}
        onScroll={Animated.event(
          [
            {
              nativeEvent: { contentOffset: { y } },
            },
          ],
          { useNativeDriver: true },
        )}
        scrollEventThrottle={16}
      />
      <GroupHeader y={y} group={group} />

      <TouchableOpacity
        onPress={() => {
          navigation.goBack();
        }}
        hitSlop={{ top: 30, left: 30, bottom: 30, right: 30 }}
        style={{
          position: 'absolute',
          top: 20,
          left: 20,
        }}
      >
        <BackIcon width={18} height={18} fill={colors.white} />
      </TouchableOpacity>
    </View>
  );
};

const HEADER_HEIGHT = 150;
const HEADER_MINIMIZED_Y = HEADER_HEIGHT;
const GroupHeader = ({
  y,
  style,
  group: { name, profilePicUrl, numMembers },
}) => {
  const translateY = y.interpolate({
    inputRange: [0, HEADER_MINIMIZED_Y],
    outputRange: [0, -100],
    extrapolate: 'clamp',
  });
  const groupNameTranslateY = y.interpolate({
    inputRange: [0, HEADER_MINIMIZED_Y],
    outputRange: [0, 35],
    extrapolate: 'clamp',
  });
  const groupNameScale = y.interpolate({
    inputRange: [0, HEADER_MINIMIZED_Y],
    outputRange: [1, 0.7],
    extrapolate: 'clamp',
  });
  const miscInfoOpacity = y.interpolate({
    inputRange: [0, HEADER_MINIMIZED_Y],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  return (
    <Animated.View
      style={[
        style,
        {
          position: 'absolute',
          transform: [{ translateY }],
          backgroundColor: colors.black,
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: HEADER_HEIGHT,
        },
      ]}
    >
      {profilePicUrl &&
        (() => {
          const size = 70;
          return (
            <Animated.View style={{ opacity: miscInfoOpacity }}>
              <Image
                source={{ uri: profilePicUrl }}
                style={{
                  width: size,
                  aspectRatio: 1,
                  borderWidth: 1,
                  borderColor: colors.white,
                  borderRadius: size / 2,
                }}
                borderRadius={size / 2}
              />
            </Animated.View>
          );
        })()}
      <Animated.Text
        style={{
          color: colors.white,
          fontWeight: 'bold',
          fontSize: 26,
          zIndex: 1,
          transform: [
            { scale: groupNameScale },
            { translateY: groupNameTranslateY },
          ],
        }}
        numberOfLines={1}
      >
        {name}
      </Animated.Text>
      <Animated.Text
        style={{ opacity: miscInfoOpacity, color: colors.gray }}
        numberOfLines={1}
      >
        {formatCount(numMembers)} members
      </Animated.Text>
    </Animated.View>
  );
};
