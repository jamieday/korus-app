import { ActionSheetIOS, TouchableOpacity } from 'react-native';
import Image from 'react-native-fast-image';
import { CircleView } from '../layout/CircleView';
import { colors } from '../../styles';
import PlusIcon from '../../../assets/images/icons/plus-simple.svg';
import React from 'react';

export const ProfilePicSelector = ({
  style,
  size,
  defaultPicSource,
  profilePicUri,
  onSelectPhoto,
  onRemovePhoto,
}) => (
  <>
    {profilePicUri || defaultPicSource ? (
      <TouchableOpacity
        activeOpacity={0.45}
        onPress={() => {
          if (!profilePicUri && defaultPicSource) {
            onSelectPhoto();
            return;
          }
          const options = ['Replace photo...', 'Remove photo', 'Cancel'];
          ActionSheetIOS.showActionSheetWithOptions(
            {
              options,
              cancelButtonIndex: options.indexOf('Cancel'),
              destructiveButtonIndex: options.indexOf('Remove photo'),
            },
            (selectedIndex) => {
              switch (selectedIndex) {
                case 0:
                  onSelectPhoto();
                  break;
                case 1:
                  onRemovePhoto();
                  break;
              }
            },
          );
        }}
      >
        <Image
          style={[
            { width: size, aspectRatio: 1, borderRadius: size / 2 },
            style,
          ]}
          source={profilePicUri ? { uri: profilePicUri } : defaultPicSource}
        />
      </TouchableOpacity>
    ) : (
      <TouchableOpacity
        onPress={() => {
          onSelectPhoto();
        }}
      >
        <CircleView fill={colors.gray} size={size}>
          <PlusIcon width={size / 2} height={size / 2} fill={colors.darkGray} />
        </CircleView>
      </TouchableOpacity>
    )}
  </>
);
