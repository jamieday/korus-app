import React from 'react';
import { Button, View, Text, ActivityIndicator } from 'react-native';
import { colors } from '../../styles';
import { SharesFeed } from './SharesFeed';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import GlobeIcon from '../../../assets/images/icons/globe.svg';
import GroupsIcon from '../../../assets/images/icons/groups.svg';
import { MyGroupsScreen } from './MyGroupsScreen';
import { createStackNavigator } from '@react-navigation/stack';
import { GroupScreen } from './GroupScreen';
import { useProfile } from '../identity/useProfile';
import { TopNavBar } from '../navigation/TopNavBar';
import { useAuthN } from '../api';
import { StartupProgress } from '../StartupProgress';

const Stack = createStackNavigator();
const Tab = createMaterialTopTabNavigator();

export const DiscoverScreen = ({ navigation, route }) => (
  <Stack.Navigator>
    <Stack.Screen name="Discover">
      {() => (
        <Tab.Navigator
          tabBar={(props) => <TopNavBar {...props} />}
          tabBarOptions={{
            showIcon: true,
            activeTintColor: colors.black,
            showLabel: false,
          }}
        >
          <Tab.Screen
            name="Global"
            component={DiscoverGlobalScreen}
            options={{
              tabBarIcon: ({ color, focused }) => (
                <GlobeIcon width={25} height={25} fill={color} />
              ),
            }}
          />
          <Tab.Screen
            name="Groups"
            component={MyGroupsScreen}
            options={{
              tabBarIcon: ({ color, focused }) => (
                <GroupsIcon width={25} height={25} fill={color} />
              ),
            }}
          />
        </Tab.Navigator>
      )}
    </Stack.Screen>

    <Stack.Screen name="Group" component={GroupScreen} />
  </Stack.Navigator>
);

const DiscoverGlobalScreen = ({ navigation, route }) => {
  const { profile } = useProfile();

  if (!profile) {
    return <StartupProgress />;
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.lightBlack,
      }}
    >
      {profile.totalFollowing === 0 ? (
        <View
          style={{
            justifyContent: 'center',
            height: '100%',
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              color: colors.white,
              marginBottom: 20,
              textAlign: 'center',
              padding: 20,
            }}
          >
            Um, this only really works with friends. And as far as we can tell,
            you don&apos;t have any.
          </Text>

          <Button
            onPress={() => {
              navigation.navigate('People');
            }}
            title="Find some friends"
          />
        </View>
      ) : (
        <SharesFeed
          scope={{ type: 'global' }}
          navigation={navigation}
          // maybe this logic should be at usage layer, just invalidate caches w/ react-query
          route={route}
        />
      )}
    </View>
  );
};
