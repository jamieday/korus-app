import {
  ActionSheetIOS,
  TouchableOpacity,
  Image,
  ImageSourcePropType,
  StyleProp,
  ImageStyle
} from 'react-native';
import { CircleView } from '../layout/CircleView';
import { colors } from '@/styles';
import PlusIcon from '@/assets/images/icons/plus-simple.svg';
import React from 'react';

interface ProfilePicSelectorProps {
  style?: StyleProp<ImageStyle>;
  size: number;
  defaultPicSource?: ImageSourcePropType;
  profilePicUri?: string;
  onSelectPhoto: () => void;
  onRemovePhoto: () => void;
}

export const ProfilePicSelector: React.FC<ProfilePicSelectorProps> = ({
  style,
  size,
  defaultPicSource,
  profilePicUri,
  onSelectPhoto,
  onRemovePhoto
}) => (
  <>
    {profilePicUri || defaultPicSource ? (
      <TouchableOpacity
        activeOpacity={0.45}
        onPress={() => {
          console.log('thing 1');
          if (!profilePicUri && defaultPicSource) {
            console.log('thing 2');
            onSelectPhoto();
            return;
          }
          const options = ['Replace photo...', 'Remove photo', 'Cancel'];
          console.log('thing 3');
          ActionSheetIOS.showActionSheetWithOptions(
            {
              options,
              cancelButtonIndex: options.indexOf('Cancel'),
              destructiveButtonIndex: options.indexOf('Remove photo')
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
            }
          );
        }}
      >
        <Image
          style={[
            { width: size, aspectRatio: 1, borderRadius: size / 2 },
            style
          ]}
          source={profilePicUri ? { uri: profilePicUri } : defaultPicSource}
        />
      </TouchableOpacity>
    ) : (
      <TouchableOpacity
        onPress={() => {
          console.log('thing 4');
          onSelectPhoto();
        }}
      >
        <CircleView style={style} fill={colors.gray} size={size}>
          <PlusIcon width={size / 2} height={size / 2} fill={colors.darkGray} />
        </CircleView>
      </TouchableOpacity>
    )}
  </>
);
