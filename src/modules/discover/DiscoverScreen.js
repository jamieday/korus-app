import React from 'react';
import { Button, View, Text } from 'react-native';
import { colors } from '../../styles';
import { SharesFeed } from './SharesFeed';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import DiscoverIcon from '../../../assets/images/pages/discover.svg';
import { MyGroupsScreen } from './MyGroupsScreen';
import { createStackNavigator } from '@react-navigation/stack';
import { GroupScreen } from './GroupScreen';
import { useApi } from '../api';
import { useProfile } from '../identity/useProfile';

const Stack = createStackNavigator();
const Tab = createMaterialTopTabNavigator();

export const DiscoverScreen = ({ navigation, route }) =>
  __DEV__ ? (
    <Stack.Navigator>
      <Stack.Screen name="Discover">
        {() => (
          <Tab.Navigator
            screenOptions={{
              tabBarIcon: ({ color, focused }) => (
                <DiscoverIcon width={50} height={50} fill={color} />
              ),
            }}
          >
            <Tab.Screen name="Global" component={DiscoverGlobalScreen} />
            <Tab.Screen name="Groups" component={MyGroupsScreen} />
          </Tab.Navigator>
        )}
      </Stack.Screen>

      <Stack.Screen name="Group" component={GroupScreen} />
    </Stack.Navigator>
  ) : (
    <DiscoverGlobalScreen navigation={navigation} route={route} />
  );

const DiscoverGlobalScreen = ({ navigation, route }) => {
  const api = useApi();
  const profile = useProfile();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.lightBlack,
      }}
    >
      {profile.followingCount === 0 ? (
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
            title={'Find some friends'}
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
