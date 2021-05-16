import React, { useRef, useState } from 'react';
import { ActivityIndicator, Button, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ProfilePicSelector } from '../../../korui/image/ProfilePicSelector';
import { useImagePicker } from '../../../korui/image/useImagePicker';
import { TextInput } from '../../../korui/TextInput';
import { colors } from '../../../styles';
import { useApi, useAuthN } from '../../api';
import { ErrorView } from '../../error/ErrorView';
import { useProfile } from '../../identity/useProfile';

export const ProfileOnboardingGate = ({ children }) => {
  const { user } = useAuthN();
  const api = useApi();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isLoading, setLoading] = useState(false);

  const {
    profile,
    error: profileError,
    isLoading: profileLoading,
    reloadProfile,
  } = useProfile();

  const {
    imageUri: profilePicUri,
    selectImage: selectProfilePic,
    clearImage: clearProfilePic,
  } = useImagePicker(profile ? profile.profilePicUrl : undefined);

  const lastNameRef = useRef();

  const submit = async () => {
    setLoading(true);
    await api.updateProfile({
      firstName: { value: firstName },
      lastName: { value: lastName },
      profilePicUri: { value: profilePicUri },
    });

    await reloadProfile();
  };

  if (!user) {
    throw new Error('Must have a user account to reach this view.');
  }

  if (profileError) {
    return (
      <ErrorView
        error={profileError.message}
        refresh={reloadProfile}
        isRefreshing={profileLoading}
      />
    );
  }

  if (profileLoading) {
    return (
      <SafeAreaView
        style={{
          backgroundColor: colors.lightBlack,
          height: '100%',
          paddingTop: 15,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <ActivityIndicator />
      </SafeAreaView>
    );
  }

  return profile.isSetup ? (
    children
  ) : (
    <View
      style={{
        alignItems: 'center',
        paddingTop: 80,
        paddingHorizontal: 45,
        flex: 1,
        backgroundColor: colors.black,
      }}
    >
      <Text
        style={{
          color: 'white',
          marginTop: 50,
          marginBottom: 12,
          fontWeight: '600',
          fontSize: 24,
          textAlign: 'center',
        }}
      >
        Almost there
      </Text>
      <Text
        style={{
          color: 'white',
          marginBottom: 25,
          fontSize: 14,
          textAlign: 'center',
        }}
      >
        Complete your profile so your friends can find you
      </Text>
      <View
        style={{
          alignItems: 'center',
          marginBottom: 50,
        }}
      >
        <View style={{ width: 250, marginBottom: 25 }}>
          <Text
            style={{
              textAlign: 'center',
              color: colors.white,
              marginBottom: 15,
              fontWeight: 'bold',
            }}
          >
            Your name
          </Text>
          <TextInput
            style={{ marginBottom: 10 }}
            autoFocus
            disabled={isLoading}
            // error={error}
            returnKeyType="next"
            onSubmitEditing={() => lastNameRef.current.focus()}
            onChangeText={setFirstName}
            value={firstName}
            placeholder="First"
          />
          <TextInput
            ref={lastNameRef}
            disabled={isLoading}
            // error={error}
            onChangeText={setLastName}
            value={lastName}
            placeholder="Last"
          />
        </View>
        <Text
          style={{
            color: colors.white,
            textAlign: 'center',
            fontWeight: 'bold',
            marginBottom: 15,
          }}
        >
          Set a profile pic
        </Text>
        <ProfilePicSelector
          style={{ marginBottom: 30 }}
          size={85}
          profilePicUri={profilePicUri}
          onSelectPhoto={selectProfilePic}
          onRemovePhoto={clearProfilePic}
        />
      </View>
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <Button onPress={submit} title="Continue" />
      )}
    </View>
  );
};
