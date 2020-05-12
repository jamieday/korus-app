/* eslint-disable react/jsx-curly-newline */
/* eslint-disable no-console */
/* eslint-disable no-shadow */
/* eslint-disable import/prefer-default-export */
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
import { colors } from '../../styles';
import FollowIcon from '../../../assets/images/icons/follow.svg';
import ProfileIcon from '../../../assets/images/pages/profile.svg';
import SelectedIcon from '../../../assets/images/icons/selected.svg';
import LoveIcon from '../../../assets/images/icons/love.svg';
import { useApi, useAuthN } from '../api';
import { formatCount } from './formatCount';
import { ErrorView } from '../error/ErrorView';

export const ProfileScreen = ({ navigation }) => {
  const api = useApi();

  const { user } = useAuthN();
  const [profile, setProfile] = React.useState('LOADING');
  const [isFollowing, setFollowing] = React.useState();
  React.useEffect(() => {
    setFollowing(profile.isFollowing);
  }, [profile]);

  const isMyProfile = user.displayName === profile.username;

  const loadProfile = async () => {
    const [profile, error] = await api.viewProfile(
      navigation.state.params?.username ?? user.displayName,
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
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <ActivityIndicator />
      </View>
    );
  }

  if (typeof profile.error !== 'undefined') {
    return <ErrorView error={profile.error} refresh={loadProfile} />;
  }

  return (
    <View style={{ backgroundColor: colors.lightBlack, height: '100%' }}>
      <ImageBackground
        style={{
          height: 250,
        }}
        source={{
          uri:
            'https://d38zjy0x98992m.cloudfront.net/c203f5af-98ae-4c42-bbb1-33560f07e8b9/19-08-07-0034_xgaplus.jpg',
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
                          api.unfollowUser(profile.username);
                        },
                      }
                    : {
                        IconComponent: FollowIcon,
                        onPress: () => {
                          setFollowing(true);
                          api.followUser(profile.username);
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
                <View style={{ width: 100, height: 100 }}></View>
              ) : (
                <View
                  style={{
                    borderRadius: 30,
                    backgroundColor: colors.blue,
                    padding: 15,
                    width: 100,
                    height: 100,
                  }}
                >
                  <Text
                    style={{
                      color: colors.white,
                    }}
                  >
                    {share.songName}
                  </Text>
                  <Text
                    style={{
                      color: colors.white,
                    }}
                  >
                    {share.artistName}
                  </Text>
                  <Text
                    style={{
                      color: colors.white,
                    }}
                  >
                    {share.totalLikes}
                  </Text>
                </View>
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
