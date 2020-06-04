/* eslint-disable import/no-unresolved */
import React from 'react';
import { View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { createStackNavigator } from '@react-navigation/stack';
import { colors } from '../../styles';

import { DiscoverScreen } from '../discover/DiscoverScreen';
import { PeopleScreen } from '../people/PeopleScreen';
import { ProfileScreen } from '../profile/ProfileScreen';
import { LikedScreen } from '../liked/LikedScreen';

import CloseIcon from '../../../assets/images/icons/close.svg';
import { LogoHeader } from './LogoHeader';
import { SelectSongScreen } from '../share/SelectSongScreen';
import { ShareSongScreen } from '../share/ShareSongScreen';
import { BottomAppBar } from './BottomAppBar/BottomAppBar';
import { PlayerScreen } from '../share/PlayerScreen';

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
      name="Player"
      component={PlayerScreen}
      options={{
        // 213c8fe5-5146-4e97-83d4-ddc63dcd7070
        headerBackTitleVisible: false,
        headerTintColor: colors.white,
        headerTitle: '',
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
    tabBar={(props) => <BottomAppBar {...props} />}
    initialRouteName="Discover"
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
