import {
  Button,
  ImageBackground,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { colors } from '../../styles';
import Image from 'react-native-fast-image';
import React from 'react';
import AddIcon from '../../../assets/images/icons/plus-simple.svg';
import LinearGradient from 'react-native-linear-gradient';

const Container = ({ children }) => (
  <View style={{ flex: 1, backgroundColor: colors.lightBlack }}>
    <View style={{ padding: 16 }}>{children}</View>
  </View>
);

const groups = [
  {
    id: 'ajfkalfjkalsfjkslfjklfjaskl',
    name: 'Hot Country',
    numMembers: 409,
    coverPhotoUrl:
      'https://i.pinimg.com/originals/54/7a/9c/547a9cc6b93e10261f1dd8a8af474e03.jpg',
    profilePhotoUrl: 'https://wallpaperaccess.com/full/869967.jpg',
  },
  {
    id: 'ajfkalfjkalsfjkslfjklfjaskl',
    name: 'Long long long long long long long long long name',
    numMembers: 409999999999999999999,
    coverPhotoUrl:
      'https://i.pinimg.com/originals/54/7a/9c/547a9cc6b93e10261f1dd8a8af474e03.jpg',
    profilePhotoUrl: 'https://wallpaperaccess.com/full/869967.jpg',
  },
];

export const GroupsScreen = () => {
  if (groups.length === 0) {
    return (
      <Container>
        <NoGroupsYet />
      </Container>
    );
  }

  return (
    <Container>
      <TouchableOpacity
        onPress={() => {
          alert('s');
        }}
        activeOpacity={0.7}
      >
        <View
          style={{
            flexDirection: 'row',
            padding: 10,
            height: 43,
            alignItems: 'center',
            backgroundColor: colors.darkGray,
            borderRadius: 10,
          }}
        >
          <Text
            style={{
              flex: 1,
              color: colors.lightGray,
              textTransform: 'uppercase',
            }}
          >
            Create new group...
          </Text>
          <AddIcon width={25} height={25} fill={colors.lightGray} />
        </View>
      </TouchableOpacity>
      {groups.map((group) => (
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => {
            alert('hi');
          }}
        >
          <ImageBackground
            resizeMode="cover"
            source={{ uri: group.coverPhotoUrl }}
            style={{
              height: 86,
              marginTop: 20,
            }}
            width={20}
            borderRadius={10}
          >
            <LinearGradient
              locations={[0, 1]}
              style={[{ height: '100%', padding: 10, borderRadius: 15 }]}
              colors={['#000000FF', '#00000044']}
            >
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%',
                }}
              >
                <View style={{ flex: 1 }}>
                  <View>
                    <Text
                      style={{
                        color: colors.darkLightGray,
                        textTransform: 'uppercase',
                        fontSize: 14,
                      }}
                      numberOfLines={1}
                    >
                      {group.numMembers} members
                    </Text>
                  </View>
                  <View>
                    <Text
                      numberOfLines={1}
                      style={{ color: colors.white, fontSize: 28 }}
                    >
                      {group.name}
                    </Text>
                  </View>
                </View>
                <View>
                  <Image
                    style={{ width: 50, aspectRatio: 1, borderRadius: 25 }}
                    source={{ uri: group.profilePhotoUrl }}
                  />
                </View>
              </View>
            </LinearGradient>
          </ImageBackground>
        </TouchableOpacity>
      ))}
    </Container>
  );
};

const NoGroupsYet = () => (
  <View
    style={{
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
    }}
  >
    <Image
      source={require('../../../assets/images/squad.png')}
      resizeMode={'cover'}
      style={{
        width: 300,
        maxWidth: '100%',
        aspectRatio: 1.4,
        borderRadius: 25,
        marginBottom: 5,
      }}
    />
    <Text
      style={{
        color: colors.lightGray,
        fontSize: 14,
        paddingHorizontal: 20,
        marginBottom: 30,

        textAlign: 'center',
      }}
    >
      Get the squad together.
    </Text>
    <Button
      title="Start a group"
      onPress={() => {
        alert('hi');
      }}
    />
  </View>
);
