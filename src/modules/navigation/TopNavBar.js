import React, { useRef } from 'react';
import { View, TouchableOpacity } from 'react-native';
import Animated, { Extrapolate, interpolate } from 'react-native-reanimated';
import { colors } from '../../styles';

export const TopNavBar = ({ state, descriptors, navigation, position }) => {
  const navWidth = useRef(0);
  const indicatorPosition = interpolate(position, {
    inputRange: state.routes.map((_, i) => i),
    outputRange: state.routes.map(
      (_, i) => (navWidth.current * i) / state.routes.length,
    ),
    extrapolate: Extrapolate.CLAMP,
  });
  return (
    <View>
      <View
        onLayout={({
          nativeEvent: {
            layout: { width },
          },
        }) => {
          navWidth.current = width;
        }}
        style={{ flexDirection: 'row' }}
      >
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];

          if (!options.tabBarIcon) {
            throw new Error(
              'Right now each top nav bar screen needs to specify a tab bar icon',
            );
          }

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
              key={route.key}
              activeOpacity={0.89}
              accessibilityRole="button"
              accessibilityStates={isFocused ? ['selected'] : []}
              onPress={onPress}
              onLongPress={onLongPress}
              style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'center',
                backgroundColor: colors.black,
              }}
            >
              <View style={{ padding: 10 }}>
                {options.tabBarIcon({ color: 'white', focused: false })}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
      <Animated.View
        style={{
          transform: [{ translateX: indicatorPosition }],
          position: 'absolute',
          bottom: 0,
          width: 100 / state.routes.length + '%',
          borderBottomWidth: 1,
          borderBottomColor: colors.white,
        }}
      />
    </View>
  );
};
