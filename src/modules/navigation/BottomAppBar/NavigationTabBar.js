import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getBottomSpace } from 'react-native-iphone-x-helper';
import { colors } from '../../../styles';

import FeedIcon from '../../../../assets/images/icons/feed-simple.svg';
import FeedSelectedIcon from '../../../../assets/images/icons/feed-fancy.svg';
import SearchIcon from '../../../../assets/images/icons/search-simple.svg';
import SearchSelectedIcon from '../../../../assets/images/icons/search-fancy.svg';
import ShareIcon from '../../../../assets/images/icons/plus-simple.svg';
import ShareSelectedIcon from '../../../../assets/images/icons/plus-fancy.svg';
import LoveIcon from '../../../../assets/images/icons/heart-simple.svg';
import LoveSelectedIcon from '../../../../assets/images/icons/heart-fancy.svg';
import ProfileIcon from '../../../../assets/images/icons/profile-simple.svg';
import ProfileSelectedIcon from '../../../../assets/images/icons/profile-fancy.svg';

export const TAB_BAR_HEIGHT = 50;

export const NavigationTabBar = ({ navigation, descriptors, state }) => {
  const renderItem = React.useCallback(
    (route, index) => {
      const { options } = descriptors[route.key];
      // const label =
      //     options.tabBarLabel !== undefined
      //         ? options.tabBarLabel
      //         : options.title !== undefined
      //         ? options.title
      //         : route.name;

      const isFocused = state.index === index;

      const onPress = () => {
        const event = navigation.emit({
          type: 'tabPress',
          target: route.key,
          canPreventDefault: true,
        });

        if (!isFocused && !event.defaultPrevented) {
          navigation.navigate(route.name);
        }
      };

      const onLongPress = () => {
        navigation.emit({
          type: 'tabLongPress',
          target: route.key,
        });
      };

      return (
        <TouchableOpacity
          activeOpacity={0.75}
          key={route.key}
          accessibilityRole="button"
          accessibilityStates={isFocused ? ['selected'] : []}
          accessibilityLabel={options.tabBarAccessibilityLabel}
          testID={options.tabBarTestID}
          onPress={onPress}
          onLongPress={onLongPress}
          style={{ flex: 1 }}
        >
          <TabIcon key={route.name} focused={isFocused} screen={route.name} />
        </TouchableOpacity>
      );
    },
    [descriptors, state],
  );

  return (
    <View
      style={{
        height: TAB_BAR_HEIGHT,
        flexDirection: 'row',
        justifyContent: 'center',
        backgroundColor: colors.black,
        borderTopColor: colors.gray,
        borderTopWidth: 1 / 3,
      }}
    >
      {state.routes.map(renderItem)}
    </View>
  );
};

const TabIcon = ({ focused, screen }) => {
  const { Icon, size = 22, extraStyle } = (() => {
    switch (screen) {
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
      case 'Activity':
        return { Icon: !focused ? LoveIcon : LoveSelectedIcon };
      case 'MyProfile':
        return { Icon: !focused ? ProfileIcon : ProfileSelectedIcon };
      default:
        throw new Error(`TAB_NAV_ICON: Can't find icon for screen ${screen}`);
    }
  })();

  return (
    <View style={[styles.tabBarItemContainer, extraStyle]}>
      <Icon
        width={size}
        height={size}
        fill={
          !focused && (screen === 'People' ? 'transparent' : colors.darkGray)
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  tabBarItemContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
