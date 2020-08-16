import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {
  Text,
  View,
  ImageBackground,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { colors } from '../../styles';
import FollowIcon from '../../../assets/images/icons/follow.svg';
import ProfileIcon from '../../../assets/images/pages/profile.svg';
import SelectedIcon from '../../../assets/images/icons/selected.svg';
import LoveIcon from '../../../assets/images/icons/love.svg';
import { useApi, useAuthN } from '../api';
import { formatCount } from './formatCount';
import { MiniShare } from './MiniShare';
import { ErrorView } from '../error/ErrorView';
import DiscoverIcon from '../../../assets/images/pages/discover.svg';
import { LikedScreen } from '../liked/LikedScreen';
import { TopNavBar } from '../navigation/TopNavBar';
import { ProfileTopNavBar } from './ProfileTopNavBar';

const Tab = createMaterialTopTabNavigator();

export const MyProfileScreen = () => (
  <Tab.Navigator
    tabBar={(props) => <ProfileTopNavBar {...props} />}
    tabBarOptions={{
      showIcon: true,
      activeTintColor: colors.black,
      showLabel: false,
    }}
  >
    <Tab.Screen
      name="Profile"
      component={ProfileScreen}
      options={{
        tabBarIcon: ({ color, focused }) => (
          <DiscoverIcon width={25} height={25} fill={color} />
        ),
      }}
    />
    <Tab.Screen
      name="Liked"
      component={LikedScreen}
      options={{
        tabBarIcon: ({ color, focused }) => (
          <LoveIcon width={25} height={25} fill={color} />
        ),
      }}
    />
  </Tab.Navigator>
);

export const ProfileScreen = ({ navigation, route }) => {
  const api = useApi();
  const { user } = useAuthN();

  const [profile, setProfile] = React.useState('LOADING');
  const [isFollowing, setFollowing] = React.useState();
  const [playingSongId, setPlayingSongId] = React.useState();

  React.useEffect(() => {
    setFollowing(profile.isFollowing);
  }, [profile]);

  React.useEffect(() => {
    navigation.setOptions({ headerTitle: profile?.username ?? '' });
  }, [profile, navigation]);

  const isMyProfile = user.displayName === profile.username;

  const loadProfile = async () => {
    const [profile, error] = await api.viewProfile(
      route.params?.id ??
        // weird "me" thing {F4355E59-9F78-400B-BA86-5517B5CF2116}
        'me',
    );
    if (error) {
      setProfile({ error });
      return;
    }
    setProfile(profile);
  };

  React.useEffect(() => {
    loadProfile();
  }, []);

  if (profile === 'LOADING') {
    return (
      <View
        style={{
          backgroundColor: colors.lightBlack,
          height: '100%',
          paddingTop: 15,
          alignItems: 'center',
        }}
      >
        <ActivityIndicator />
      </View>
    );
  }

  if (typeof profile.error !== 'undefined') {
    return <ErrorView error={profile.error} refresh={loadProfile} />;
  }

  const profileImgSize = 55;
  return (
    <View style={{ backgroundColor: colors.lightBlack, height: '100%' }}>
      <ImageBackground
        style={{
          height: 250,
        }}
        source={{
          uri: profile.coverPhotoUrl,
          height: 250,
        }}
      >
        <LinearGradient
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: '100%',
          }}
          colors={['#00000000', '#000']}
        >
          {/* <Image
            style={{
              width: profileImgSize,
              height: profileImgSize,
              overflow: 'hidden',
              borderRadius: profileImgSize / 2,
            }}
            source={{
              uri: profile.profilePicUrl,
              width: profileImgSize,
              height: profileImgSize,
            }}
          /> */}
          <Text
            style={{
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
                    hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
                  >
                    <IconComponent width={10} height={10} fill={colors.white} />
                  </TouchableOpacity>
                );
              })()
            )}
          </View>
        </LinearGradient>
      </ImageBackground>
      {(() => {
        const numColumns = 3;
        const songSize = 105;
        return (
          <FlatList
            columnWrapperStyle={{
              flexDirection: 'row',
              margin: 13,
              justifyContent: 'space-between',
            }}
            data={((arr) => {
              const remainder = arr.length % numColumns;
              return arr.concat([...Array(remainder)].map((_) => 'blank'));
            })(profile.shares)}
            keyExtractor={(item, index) =>
              item === 'blank' ? `b_${index}` : item.id
            }
            renderItem={({ item: share }) =>
              share === 'blank' ? (
                <View style={{ width: songSize, height: songSize }} />
              ) : (
                <MiniShare
                  style={{ width: songSize, height: songSize }}
                  miniShareData={share}
                  isPlaying={share.id === playingSongId}
                  onPlay={() => setPlayingSongId(share.id)}
                  onPause={() => setPlayingSongId(undefined)}
                />
              )
            }
            numColumns={numColumns}
            // stickyHeaderIndices={[0]}
          />
        );
      })()}
    </View>
  );
};
