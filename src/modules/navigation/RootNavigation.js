import React from 'react';
import { Image, TouchableOpacity, View, SafeAreaView } from 'react-native';
import { createAppContainer, createStackNavigator } from 'react-navigation';
import MainTabNavigator from './MainTabNavigator';
import { colors, fonts } from '../../styles';
import { ProfileScreen } from '../profile/ProfileScreen';
import KorusLogo from '../../../assets/images/logo.svg';

const stackNavigator = createStackNavigator(
  {
    Main: {
      screen: MainTabNavigator,
      navigationOptions: () => ({
        header: () => (
          <SafeAreaView
            style={{
              backgroundColor: 'black',
            }}
          >
            <View style={{ height: 47, width: '100%', alignItems: 'center' }}>
              <View style={{ margin: 10 }}>
                <KorusLogo width={119} height={27} fill={colors.white} />
              </View>
            </View>
          </SafeAreaView>
        ),
      }),
    },
    Profile: { screen: ProfileScreen },
  },
  {
    defaultNavigationOptions: () => ({
      titleStyle: {
        fontFamily: fonts.primaryLight,
      },
      headerStyle: {
        backgroundColor: colors.black,
        borderBottomWidth: 0,
        height: 47,
      },
    }),
  },
);

export default createAppContainer(stackNavigator);
