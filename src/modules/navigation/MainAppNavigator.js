/* eslint-disable import/no-unresolved */
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { createStackNavigator } from '@react-navigation/stack';
import { colors } from '../../styles';

import { DiscoverScreen } from '../discover/DiscoverScreen';
import { PeopleScreen } from '../people/PeopleScreen';
import { ProfileScreen } from '../profile/ProfileScreen';
import { LikedScreen } from '../liked/LikedScreen';

import CloseIcon from '../../../assets/images/icons/close.svg';

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
import { LogoHeader } from './LogoHeader';
import { SelectSongScreen } from '../share/SelectSongScreen';
import { ShareSongScreen } from '../share/ShareSongScreen';

const styles = StyleSheet.create({
  tabBarItemContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const Stack = createStackNavigator();

const Tab = createBottomTabNavigator();

export const MainAppNavigator = () => (
  <Stack.Navigator mode="modal">
    <Stack.Screen
      name="Main"
      component={TabNavigator}
      options={{
        header: LogoHeader,
      }}
    />

    <Stack.Screen
      name="Select a song"
      component={SelectSongScreen}
      options={{
        // 213c8fe5-5146-4e97-83d4-ddc63dcd7070
        headerBackTitleVisible: false,
        headerTintColor: colors.white,
        headerBackImage: ({ tintColor }) => (
          <View style={{ padding: 20 }}>
            <CloseIcon width={15} height={15} fill={tintColor} />
          </View>
        ),
        headerStyle: {
          backgroundColor: colors.black,
          shadowOffset: {
            height: 0,
          },
        },
      }}
    />
  </Stack.Navigator>
);

export const TabNavigator = () => (
  <Tab.Navigator
    initialRouteName="Discover"
    tabBarOptions={{
      style: { backgroundColor: colors.black, borderTopColor: colors.darkGray },
      showLabel: false,
    }}
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused }) => {
        const { name } = route;
        const { Icon, size = 22, extraStyle } = (() => {
          switch (name) {
            case 'Discover':
              return {
                Icon: !focused ? FeedIcon : FeedSelectedIcon,
                size: 20,
              };
            case 'People':
              return {
                Icon: !focused ? SearchIcon : SearchSelectedIcon,
                size: 25,
                extraStyle: { marginTop: 5 },
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
          <View style={[styles.tabBarItemContainer, extraStyle]}>
            <Icon
              width={size}
              height={size}
              fill={
                !focused &&
                (name === 'People' ? 'transparent' : colors.darkGray)
              }
            />
          </View>
        );
      },
    })}
  >
    <Tab.Screen name="Discover" component={DiscoverScreen} />
    <Tab.Screen name="People" component={PeopleScreen} />
    <Tab.Screen
      name="Share"
      component={ShareSongScreen}
      listeners={({ navigation, route }) => ({
        tabPress: (e) => {
          e.preventDefault();
          navigation.push('Select a song');
        },
      })}
    />
    <Tab.Screen name="Liked" component={LikedScreen} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>
);
