import React, { useState ,useLayoutEffect} from 'react';
import { View, ActivityIndicator, Animated, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { colors } from '../../styles';
import LoveIcon from '../../../assets/images/icons/love.svg';
import { toQuery, useApi } from '../api';
import { MiniShare } from './MiniShare';
import { ErrorView } from '../error/ErrorView';
import DiscoverIcon from '../../../assets/images/pages/discover.svg';
import { LikedScreen } from '../liked/LikedScreen';
import {
  optimisticFollow,
  optimisticUnfollow,
  useProfile,
} from '../identity/useProfile';
import { INIT_HEADER_HEIGHT, ProfileTopNavBar } from './ProfileTopNavBar';
import { useQuery } from 'react-query';

const Tab = createMaterialTopTabNavigator();

export const MyProfileScreen = ({ navigation, route }) => {
  const api = useApi();

  const { profile, error: profileError, reloadProfile , isLoading} = useProfile(
    route.params?.id,
  );
  const [playingSongId, setPlayingSongId] = useState();

  const [y, _] = useState(new Animated.Value(0));

  useLayoutEffect(() => {
    navigation.setOptions({
      title: profile?.username ? `${profile.username}'s profile` : '',
    });
  }, [profile, navigation]);

  // massive hack
  const hasNavigationHeader = !!route.params?.id;

  if (isLoading) {
    return (
      <SafeAreaView
        style={{
          backgroundColor: colors.lightBlack,
          height: '100%',
          paddingTop: 15,
          alignItems: 'center',
        }}
      >
        <ActivityIndicator />
      </SafeAreaView>
    );
  }

  if (profileError) {
    return <ErrorView error={profileError} refresh={reloadProfile} />;
  }

  return (
    <Tab.Navigator
      tabBar={(props) => (
        <ProfileTopNavBar
          {...props}
          y={y}
          hasNavigationHeader={hasNavigationHeader}
        />
      )}
      tabBarOptions={{
        showIcon: true,
        activeTintColor: colors.black,
        showLabel: false,
      }}
      screenOptions={{ profile }}
    >
      <Tab.Screen
        name="Profile"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <DiscoverIcon width={25} height={25} fill={color} />
          ),
        }}
      >
        {(props) => <ProfileScreen {...props} y={y} profile={profile} />}
      </Tab.Screen>
      <Tab.Screen
        name="Liked"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <LoveIcon width={25} height={25} fill={color} />
          ),
        }}
      >
        {(props) => <LikedScreen {...props} profile={profile} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

export const ProfileScreen = ({ y, navigation, route, profile }) => {
  // const startPositionY = y.interpolate({
  //   inputRange: [0, 180],
  //   outputRange: [0, -180],
  //   extrapolate: 'clamp',
  // });

  return (
    <View
      style={{
        // transform: [{ translateY: startPositionY }],
        backgroundColor: colors.lightBlack,
        flex: 1,
      }}
    >
      {(() => {
        const numColumns = 3;
        const songSize = 105;
        return (
          <FlatList
            // onScroll={Animated.event(
            //   [
            //     {
            //       nativeEvent: { contentOffset: { y } },
            //     },
            //   ],
            //   { useNativeDriver: true },
            // )}
            // scrollEventThrottle={16}
            columnWrapperStyle={{
              flexDirection: 'row',
              margin: 13,
              justifyContent: 'space-between',
            }}
            data={((arr) => {
              const remainder = arr.length % numColumns;
              return arr.concat([...Array(remainder)].map((_) => 'blank'));
            })(profile.shares)}
            keyExtractor={(item, index) =>
              item === 'blank' ? `b_${index}` : item.id
            }
            renderItem={({ item: share }) =>
              share === 'blank' ? (
                <View style={{ width: songSize, height: songSize }} />
              ) : (
                <MiniShare
                  style={{ width: songSize, height: songSize }}
                  miniShareData={share}
                  onSelectSong={() =>
                    navigation.navigate('User shares', {
                      profile,
                      scrollToShareId: share.id,
                    })
                  }
                />
              )
            }
            numColumns={numColumns}
          />
        );
      })()}
    </View>
  );
};
