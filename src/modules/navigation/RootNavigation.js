import React from 'react';
import { Image, TouchableOpacity } from 'react-native';
import { createAppContainer, createStackNavigator } from 'react-navigation';
import MainTabNavigator from './MainTabNavigator';
import { colors, fonts } from '../../styles';

const stackNavigator = createStackNavigator(
  {
    Main: {
      screen: MainTabNavigator,
      navigationOptions: () => ({
        title: 'CHORUS',
        headerLeft: null,
        // headerBackground: (
        //   <Image
        //     style={{
        //       flex: 1,
        //       width,
        //     }}
        //     source={headerBackground}
        //     resizeMode="cover"
        //   />
        // ),
      }),
    },
  },
  {
    defaultNavigationOptions: () => ({
      titleStyle: {
        fontFamily: fonts.primaryLight,
      },
      headerStyle: {
        backgroundColor: colors.black,
        borderBottomWidth: 0,
      },
      // headerBackground: (
      //   <Image
      //     style={{ flex: 1 }}
      //     source={headerBackground}
      //     resizeMode="cover"
      //   />
      // ),
      headerTitleStyle: {
        color: colors.white,
        fontFamily: fonts.primaryRegular,
      },
      headerTintColor: '#222222',
      headerLeft: (props) => (
        <TouchableOpacity
          onPress={props.onPress}
          style={{
            paddingLeft: 25,
          }}
        >
          <Image
            source={require('../../../assets/images/icons/arrow-back.png')}
            resizeMode="contain"
            style={{
              height: 20,
            }}
          />
        </TouchableOpacity>
      ),
    }),
  },
);

export default createAppContainer(stackNavigator);
