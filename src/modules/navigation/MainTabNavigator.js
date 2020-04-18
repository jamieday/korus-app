/* eslint-disable import/no-unresolved */
import React from 'react';
import { processColor, Image, View, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from 'react-navigation';

import { colors, fonts } from '../../styles';

import HomeScreen from '../home/HomeViewContainer';
import DiscoverScreen from '../discover/DiscoverViewContainer';
import { LoveView } from '../love/LoveView';
import DiscoverIcon from '../../../assets/images/pages/discover.svg';

const iconCalendar = require('../../../assets/images/pages/calendar.png');
const iconDiscover = require('../../../assets/images/pages/chat.png');
const iconComponents = require('../../../assets/images/tabbar/components.png');

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
    fontFamily: fonts.primaryRegular,
    color: colors.white,
    fontSize: 18,
  },
});

export default createBottomTabNavigator(
  {
    Discover: {
      screen: DiscoverScreen,
      navigationOptions: {
        header: null,
      },
    },
    Share: {
      screen: HomeScreen,
      navigationOptions: {
        header: null,
      },
    },
    ...(__DEV__ && {
      Love: {
        screen: LoveView,
        navigationOptions: {
          header: null,
        },
      },
    }),
    // Pages: {
    //   screen: PagesScreen,
    //   navigationOptions: {
    //     header: (
    //       <View style={styles.headerContainer}>
    //         <Image style={styles.headerImage} source={hederBackground} />
    //         <Text style={styles.headerCaption}>Pages</Text>
    //       </View>
    //     ),
    //   },
    // },
    // Components: {
    //   screen: ComponentsScreen,
    //   navigationOptions: {
    //     header: (
    //       <View style={styles.headerContainer}>
    //         <Image style={styles.headerImage} source={hederBackground} />
    //         <Text style={styles.headerCaption}>Components</Text>
    //       </View>
    //     ),
    //   },
    // },
  },
  {
    defaultNavigationOptions: ({ navigation }) => ({
      // eslint-disable-next-line react/prop-types
      tabBarIcon: ({ focused }) => {
        const { routeName } = navigation.state;
        let iconSource;
        switch (routeName) {
          case 'Share':
            iconSource = iconDiscover;
            break;
          case 'Calendar':
            iconSource = iconCalendar;
            break;
          case 'Discover':
            return (
              <View style={styles.tabBarItemContainer}>
                <DiscoverIcon
                  width={27}
                  fill={focused ? colors.white : colors.gray}
                />
              </View>
            );
            break;
          case 'Pages':
            iconSource = require('../../../assets/images/tabbar/pages.png');
            break;
          case 'Components':
            iconSource = iconComponents;
            break;
          case 'Profile':
            iconSource = icon;
          default:
            iconSource = iconComponents;
        }
        return (
          <View style={styles.tabBarItemContainer}>
            <Image
              resizeMode="contain"
              source={iconSource}
              style={[styles.tabBarIcon, focused && styles.tabBarIconFocused]}
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
