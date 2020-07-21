/* eslint-disable import/no-unresolved */
import React from 'react';
import { View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { createStackNavigator } from '@react-navigation/stack';
import { colors } from '../../styles';

import { DiscoverScreen } from '../discover/DiscoverScreen';
import { PeopleScreen } from '../people/PeopleScreen';
import { MyProfileScreen } from '../profile/ProfileScreen';

import CloseIcon from '../../../assets/images/icons/close.svg';
import { LogoHeader } from './LogoHeader';
import { SelectSongScreen } from '../share/SelectSongScreen';
import { ShareSongScreen } from '../share/ShareSongScreen';
import { BottomAppBar } from './BottomAppBar/BottomAppBar';
import { ActivityScreen } from '../activity/ActivityScreen';
import { CreateGroupScreen } from '../discover/CreateGroupScreen';

const ModalStack = createStackNavigator();

const Tab = createBottomTabNavigator();

export const MainAppNavigator = () => <ModalNavigator />;

const ModalNavigator = () => (
  <ModalStack.Navigator mode="modal">
    <ModalStack.Screen
      name="App"
      component={TabNavigator}
      options={{
        header: LogoHeader,
      }}
    />

    <ModalStack.Screen
      name="Create new group"
      component={CreateGroupScreen}
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

    <ModalStack.Screen
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
  </ModalStack.Navigator>
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
    <Tab.Screen name="Activity" component={ActivityScreen} />
    <Tab.Screen name="MyProfile" component={MyProfileScreen} />
  </Tab.Navigator>
);
