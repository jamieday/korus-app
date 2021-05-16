import { launchImageLibrary } from 'react-native-image-picker';
import { useState, useEffect } from 'react';

// See https://github.com/zoontek/react-native-permissions
// For a better permissions handling experience

export const useImagePicker = (
  initialImageUri = undefined,
  options = undefined,
) => {
  const [imageUri, setImageUri] = useState(initialImageUri);
  useEffect(() => setImageUri(initialImageUri), [initialImageUri]);

  return {
    imageUri,
    selectImage: () =>
      new Promise((resolve) =>
        launchImageLibrary(
          {
            mediaType: 'photo',
            maxWidth: 1024,
            maxHeight: 1024,
            quality: 0.2,
            title: options?.title,
            cameraType: 'front',
            includeBase64: true,
          },
          (response) => {
            if (response.base64) {
              const imageUri = `data:image/jpeg;base64,${response.base64}`;
              setImageUri(imageUri);
              resolve(imageUri);
            }
          },
        ),
      ),
    clearImage: () => setImageUri(undefined),
  };
};
