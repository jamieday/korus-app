/* eslint-disable import/no-unresolved */
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from 'react-navigation';

import { colors, fonts } from '../../styles';

import { ShareScreenContainer as ShareScreen } from '../home/ShareViewContainer';
import { DiscoverScreen } from '../discover/DiscoverScreen';
import { GroupsScreen } from '../groups/GroupsScreen';
import { ProfileScreen } from '../profile/ProfileScreen';
import { LikedScreen } from '../liked/LikedScreen';

import DiscoverIcon from '../../../assets/images/pages/discover.svg';
import ShareIcon from '../../../assets/images/icons/share.svg';
import GroupsIcon from '../../../assets/images/icons/groups.svg';
import ProfileIcon from '../../../assets/images/pages/profile.svg';
import LoveIcon from '../../../assets/images/icons/love.svg';

const styles = StyleSheet.create({
  tabBarItemContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    // borderBottomWidth: 2,
    // borderBottomColor: colors.darkGray,
    paddingHorizontal: 10,
  },
  tabBarIcon: {
    width: 23,
    height: 23,
    tintColor: colors.grey,
  },
  tabBarIconFocused: {
    tintColor: colors.white,
  },
  headerContainer: {
    height: 70,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 10,
  },
  headerImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    height: 70,
    resizeMode: 'cover',
  },
  headerCaption: {
    color: colors.white,
    fontSize: 18,
  },
});

export default createBottomTabNavigator(
  {
    Discover: {
      screen: DiscoverScreen,
    },
    People: {
      screen: GroupsScreen,
    },
    Share: {
      screen: ShareScreen,
    },
    Liked: {
      screen: LikedScreen,
    },
    Profile: {
      screen: ProfileScreen,
    },
  },
  {
    defaultNavigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused }) => {
        const { routeName } = navigation.state;
        const { Icon, size = 20 } = (() => {
          switch (routeName) {
            case 'Discover':
              return { Icon: DiscoverIcon };
            case 'Share':
              return { Icon: ShareIcon };
            case 'People':
              return { Icon: GroupsIcon };
            case 'Liked':
              return { Icon: LoveIcon };
            case 'Profile':
              return { Icon: ProfileIcon };
            default:
              throw new Error("Can't find icon");
          }
        })();
        return (
          <View style={styles.tabBarItemContainer}>
            <Icon
              width={size}
              height={size}
              fill={focused ? colors.white : colors.gray}
            />
          </View>
        );
      },
    }),
    tabBarPosition: 'bottom',
    animationEnabled: false,
    swipeEnabled: false,
    tabBarOptions: {
      showLabel: true,
      style: {
        backgroundColor: colors.black,
        borderTopWidth: 0.5,
        borderTopColor: '#666',
      },
      labelStyle: {
        color: colors.grey,
      },
    },
  },
);
