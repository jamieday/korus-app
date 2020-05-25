import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { MainAppNavigator } from './MainAppNavigator';
import { colors } from '../../styles';
import { ProfileScreen } from '../profile/ProfileScreen';
import { LogoHeader } from './LogoHeader';
import { ShareSongScreen } from '../share/ShareSongScreen';

const Stack = createStackNavigator();

export const RootStack = () => (
  <Stack.Navigator
    initialRouteName="Main"
    screenOptions={() => ({
      headerStyle: {
        backgroundColor: colors.black,
        borderBottomWidth: 0,
      },
    })}
  >
    <Stack.Screen
      name="Main"
      component={MainAppNavigator}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="Profile"
      component={ProfileScreen}
      options={{
        // 213c8fe5-5146-4e97-83d4-ddc63dcd7070
        headerBackTitleVisible: false,
        headerTintColor: colors.white,
        headerStyle: {
          backgroundColor: colors.black,
          shadowOffset: {
            height: 0,
          },
        },
      }}
    />

    <Stack.Screen
      name="Share a song"
      component={ShareSongScreen}
      options={{
        // 213c8fe5-5146-4e97-83d4-ddc63dcd7070
        headerBackTitleVisible: false,
        headerTintColor: colors.white,
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
