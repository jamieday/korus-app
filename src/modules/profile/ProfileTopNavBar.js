import React, { useEffect, useState } from 'react';
import { TopNavBar } from '../navigation/TopNavBar';
import { ImageBackground, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import { colors } from '../../styles';
import LoveIcon from '../../../assets/images/icons/love.svg';
import { formatCount } from './formatCount';
import ProfileIcon from '../../../assets/images/pages/profile.svg';
import SelectedIcon from '../../../assets/images/icons/selected.svg';
import FollowIcon from '../../../assets/images/icons/follow.svg';
import { useApi, useAuthN } from '../api';

import { ProfilePicSelector } from '../../korui/image/ProfilePicSelector';
import { useImagePicker } from '../../korui/image/useImagePicker';
import { log } from '../utils/log';
import { Image } from '../../korui/image/Image';

export const INIT_HEADER_HEIGHT = 200;

export const ProfileTopNavBar = (props) => {
  const {
    options: { profile, headerShown },
  } = props.descriptors[props.state.routes[props.state.index].key];
  // const y = props.y;

  const api = useApi();
  const { user } = useAuthN();

  if (!profile) {
    return null;
  }

  const isMyProfile = user.displayName === profile.username;

  const [isFollowing, setFollowing] = useState(false);
  useEffect(() => setFollowing(profile.isFollowing), [profile]);

  const profileImgSize = 55;

  const {
    imageUri: profilePicUri,
    selectImage: selectProfilePicImage,
    clearImage: clearProfilePicImage,
  } = useImagePicker(profile.profilePicUrl, {
    title: 'choose a profile display pic ( ͡° ͜ʖ ͡°)',
  });

  const selectProfilePic = async () => {
    const imageUri = await selectProfilePicImage();
    const [_, error] = await api.updateProfilePic(imageUri);
    if (error) {
      // TODO unhappy path... keep it simple
      // probably want loading indicators for this (blocking)
      // rather than magically async doing this
      // or else we can have crazy competing api calls
    }
  };

  const clearProfilePic = async () => {
    clearProfilePicImage();
    const [_, _error] = await api.updateProfilePic(undefined);
  };

  const {
    imageUri: coverPhotoUri,
    selectImage: selectCoverPhotoImage,
  } = useImagePicker(profile.coverPhotoUrl, {
    title: 'choose a cover photo ヾ(⌐■_■)ノ♪',
  });

  const selectCoverPhoto = async () => {
    const imageUri = await selectCoverPhotoImage();
    const [_, error] = await api.updateCoverPhoto(imageUri);
    if (error) {
      // TODO unhappy path... keep it simple
      // probably want loading indicators for this (blocking)
      // rather than magically async doing this
      // or else we can have crazy competing api calls
    }
  };
  //
  // const THRESHOLD_Y_NORMAL = 115;
  // const THRESHOLD_Y_SLOW = 190;
  //
  // const usernameY = y.interpolate({
  //   inputRange: [0, THRESHOLD_Y_NORMAL],
  //   outputRange: [0, -70],
  //   extrapolate: 'clamp',
  // });
  //
  // const fadingOpacity = y.interpolate({
  //   inputRange: [0, THRESHOLD_Y_SLOW],
  //   outputRange: [1, 0],
  //   extrapolate: 'clamp',
  // });
  //
  // const invertedY = y.interpolate({
  //   inputRange: [0, THRESHOLD_Y_NORMAL],
  //   outputRange: [0, -93],
  //   extrapolate: 'clamp',
  // });
  //
  // const fadingOpacityIcons = y.interpolate({
  //   inputRange: [0, THRESHOLD_Y_SLOW * 0.6],
  //   outputRange: [1, 0],
  //   extrapolate: 'clamp',
  // });
  //
  // const invertedYIcons = y.interpolate({
  //   inputRange: [0, THRESHOLD_Y_SLOW],
  //   outputRange: [0, -110],
  //   extrapolate: 'clamp',
  // });

  // so much hacks
  const height = !props.hasNavigationHeader ? 195 : 150;

  // super weird thing will fix later
  const TouchableOpacityIfMyProfile = ({ children, ...props }) =>
    isMyProfile ? (
      <TouchableOpacity {...props}>{children}</TouchableOpacity>
    ) : (
      <View {...props}>{children}</View>
    );

  const Background = ({ style, children }) => (
    <View style={[{ height, backgroundColor: colors.black }, style]}>
      <TouchableOpacityIfMyProfile
        activeOpacity={0.7}
        onPress={selectCoverPhoto}
      >
        {coverPhotoUri ? (
          <ImageBackground
            style={
              {
                // opacity: fadingOpacity,
              }
            }
            source={{
              uri: coverPhotoUri,
              height,
            }}
          >
            <LinearGradient
              style={{
                width: '100%',
                height: '100%',
              }}
              colors={['#00000000', '#000']}
            >
              {children}
            </LinearGradient>
          </ImageBackground>
        ) : (
          <View>{children}</View>
        )}
      </TouchableOpacityIfMyProfile>
    </View>
  );

  const SafeAreaViewIfMyProfile = !props.hasNavigationHeader
    ? SafeAreaView
    : View;

  return (
    <View>
      {profile && (
        <Background>
          <SafeAreaViewIfMyProfile
            style={{
              marginTop: 15,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <View
            // style={{
            // opacity: fadingOpacityIcons,
            // transform: [{ translateY: invertedYIcons }],
            // }}
            >
              {isMyProfile ? (
                <ProfilePicSelector
                  style={{ borderWidth: 1, borderColor: colors.white }}
                  size={profileImgSize}
                  defaultPicSource={require('../../../assets/images/default-profile.png')}
                  profilePicUri={profilePicUri}
                  onSelectPhoto={selectProfilePic}
                  onRemovePhoto={clearProfilePic}
                />
              ) : (
                <Image
                  style={{
                    backgroundColor: colors.lighterBlackTrans,
                    borderWidth: 1,
                    borderColor: colors.white,
                    width: profileImgSize,
                    aspectRatio: 1,
                    borderRadius: profileImgSize / 2,
                  }}
                  source={
                    profilePicUri
                      ? { uri: profilePicUri }
                      : require('../../../assets/images/default-profile.png')
                  }
                />
              )}
            </View>
            <Text
              style={{
                // transform: [{ translateY: usernameY }],
                color: colors.white,
                fontWeight: 'bold',
                fontSize: 28,
                marginBottom: 5,
              }}
            >
              {profile.username}
            </Text>
            <View
              style={{
                // opacity: fadingOpacityIcons,
                // transform: [{ translateY: invertedYIcons }],
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <LoveIcon
                style={{ marginRight: 3 }}
                width={16}
                height={16}
                fill={colors.white}
              />
              <Text style={{ color: colors.white }}>
                {formatCount(profile.totalLikes)}
              </Text>
              <View
                style={{
                  marginHorizontal: 5,
                  alignSelf: 'stretch',
                  borderLeftColor: colors.white,
                  borderLeftWidth: 1,
                }}
              />
              {isMyProfile ? (
                <>
                  <ProfileIcon
                    style={{ marginRight: 3 }}
                    width={16}
                    height={16}
                    fill={colors.white}
                  />
                  <Text style={{ color: colors.white }}>
                    {formatCount(profile.totalFollowers)}
                  </Text>
                </>
              ) : (
                (() => {
                  const { IconComponent, onPress } = ((isFollowing) =>
                    isFollowing
                      ? {
                          IconComponent: SelectedIcon,
                          onPress: () => {
                            setFollowing(false);
                            api.unfollowUser(profile.userId);
                          },
                        }
                      : {
                          IconComponent: FollowIcon,
                          onPress: () => {
                            setFollowing(true);
                            api.followUser(profile.userId);
                          },
                        })(isFollowing);

                  return (
                    <TouchableOpacity
                      style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: 50,
                        // height: 5,
                        borderColor: colors.white,
                        borderWidth: 1,
                        paddingVertical: 3,
                      }}
                      onPress={onPress}
                      activeOpacity={0.6}
                      hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
                    >
                      <IconComponent
                        width={10}
                        height={10}
                        fill={colors.white}
                      />
                    </TouchableOpacity>
                  );
                })()
              )}
            </View>
          </SafeAreaViewIfMyProfile>
        </Background>
      )}
      <View>
        <TopNavBar {...props} />
      </View>
    </View>
  );
};
