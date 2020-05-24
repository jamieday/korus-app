/* eslint-disable import/no-unresolved */
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from 'react-navigation';

import { colors } from '../../styles';

import { ShareScreenContainer as ShareScreen } from '../home/ShareViewContainer';
import { DiscoverScreen } from '../discover/DiscoverScreen';
import { GroupsScreen } from '../groups/GroupsScreen';
import { ProfileScreen } from '../profile/ProfileScreen';
import { LikedScreen } from '../liked/LikedScreen';

import FeedIcon from '../../../assets/images/icons/feed-simple.svg';
import FeedSelectedIcon from '../../../assets/images/icons/feed-fancy.svg';

import ShareIcon from '../../../assets/images/icons/plus-simple.svg';
import ShareSelectedIcon from '../../../assets/images/icons/plus-fancy.svg';

import SearchIcon from '../../../assets/images/icons/search-simple.svg';
import SearchSelectedIcon from '../../../assets/images/icons/search-fancy.svg';

import ProfileIcon from '../../../assets/images/icons/profile-simple.svg';
import ProfileSelectedIcon from '../../../assets/images/icons/profile-fancy.svg';

import LoveIcon from '../../../assets/images/icons/heart-simple.svg';
import LoveSelectedIcon from '../../../assets/images/icons/heart-fancy.svg';

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
        const { Icon, size = 22 } = (() => {
          switch (routeName) {
            case 'Discover':
              return { Icon: !focused ? FeedIcon : FeedSelectedIcon, size: 20 };
            case 'People':
              return {
                Icon: !focused ? SearchIcon : SearchSelectedIcon,
                size: 25,
              };
            case 'Share':
              return {
                Icon: !focused ? ShareIcon : ShareSelectedIcon,
                size: 32,
              };
            case 'Liked':
              return { Icon: !focused ? LoveIcon : LoveSelectedIcon };
            case 'Profile':
              return { Icon: !focused ? ProfileIcon : ProfileSelectedIcon };
            default:
              throw new Error("Can't find icon");
          }
        })();
        return (
          <View style={styles.tabBarItemContainer}>
            <Icon
              width={size}
              height={size}
              fill={
                !focused &&
                (routeName === 'People' ? 'transparent' : colors.darkGray)
              }
            />
          </View>
        );
      },
      title: undefined,
    }),
    tabBarPosition: 'bottom',
    animationEnabled: false,
    swipeEnabled: false,
    tabBarOptions: {
      showLabel: false,
      style: {
        backgroundColor: 'black',
        padding: 10,
        borderTopWidth: 1,
        borderTopColor: '#dddddd50',
      },
    },
  },
);
