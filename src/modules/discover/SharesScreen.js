import React, { useState } from 'react';
import { SharesFeed } from './SharesFeed';
import { SafeAreaView, Animated, TouchableOpacity, View } from 'react-native';
import { colors } from '../../styles';
import BackIcon from '../../../assets/images/icons/back.svg';
import { ProfileImage } from '../../korui/image/ProfileImage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const SharesScreen = ({
  scope,
  navigation,
  route,
  title,
  imageSource,
  description,
  hasNavigationHeader,
}) => {
  const [y, _] = useState(new Animated.Value(0));

  const safeAreaInsets = useSafeAreaInsets();

  const headerHeight = 150 + (hasNavigationHeader ? 0 : safeAreaInsets.top);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.lightBlack,
      }}
    >
      <SharesFeed
        style={{
          position: 'absolute',
          paddingTop: headerHeight,
          width: '100%',
        }}
        scope={scope}
        navigation={navigation}
        route={route}
        onScroll={Animated.event(
          [
            {
              nativeEvent: { contentOffset: { y } },
            },
          ],
          { useNativeDriver: true },
        )}
        scrollEventThrottle={16}
      />
      <ScopeHeader
        y={y}
        headerHeight={headerHeight}
        title={title}
        imageSource={imageSource}
        description={description}
      />

      <TouchableOpacity
        onPress={() => {
          navigation.goBack();
        }}
        hitSlop={{ top: 30, left: 30, bottom: 30, right: 30 }}
        style={{
          position: 'absolute',
          top: 20 + (hasNavigationHeader ? 0 : safeAreaInsets.top),
          left: 20,
        }}
      >
        <BackIcon width={18} height={18} fill={colors.white} />
      </TouchableOpacity>
    </View>
  );
};

const AnimatedSafeAreaView = Animated.createAnimatedComponent(SafeAreaView);

const ScopeHeader = ({
  y,
  headerHeight,
  style,
  title,
  imageSource,
  description,
}) => {
  const headerMinimizedY = headerHeight;

  const translateY = y.interpolate({
    inputRange: [0, headerMinimizedY],
    outputRange: [0, -100],
    extrapolate: 'clamp',
  });
  const titleNameTranslateY = y.interpolate({
    inputRange: [0, headerMinimizedY],
    outputRange: [0, 35],
    extrapolate: 'clamp',
  });
  const titleNameScale = y.interpolate({
    inputRange: [0, headerMinimizedY],
    outputRange: [1, 0.7],
    extrapolate: 'clamp',
  });
  const miscInfoOpacity = y.interpolate({
    inputRange: [0, headerMinimizedY],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  return (
    <AnimatedSafeAreaView
      style={[
        style,
        {
          position: 'absolute',
          transform: [{ translateY }],
          backgroundColor: colors.black,
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: headerHeight,
        },
      ]}
    >
      {imageSource && (
        <Animated.View style={{ opacity: miscInfoOpacity }}>
          <ProfileImage source={imageSource} size={70} />
        </Animated.View>
      )}
      <Animated.Text
        style={{
          color: colors.white,
          fontWeight: 'bold',
          fontSize: 26,
          zIndex: 1,
          transform: [
            { scale: titleNameScale },
            { translateY: titleNameTranslateY },
          ],
        }}
        numberOfLines={1}
      >
        {title}
      </Animated.Text>
      {/*<AnimatedTouchableOpacity*/}
      {/*  style={{ move the style here- opacity: miscInfoOpacity }}*/}
      {/*  disabled={true}*/}
      {/*  // onPress={() => setMembersDialogVisible(true)}*/}
      {/*>*/}
      {description && (
        <Animated.Text
          style={{ color: colors.gray, opacity: miscInfoOpacity }}
          numberOfLines={1}
        >
          {description}
        </Animated.Text>
      )}
      {/*</AnimatedTouchableOpacity>*/}
    </AnimatedSafeAreaView>
  );
};

// const AnimatedTouchableOpacity = Animated.createAnimatedComponent(
//   TouchableOpacity,
// );
