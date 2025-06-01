import {
  launchImageLibrary,
  ImageLibraryOptions,
  ImagePickerResponse
} from 'react-native-image-picker';
import { useState, useEffect } from 'react';

// See https://github.com/zoontek/react-native-permissions
// For a better permissions handling experience

export const useImagePicker = (
  initialImageUri: string | undefined = undefined,
  options: ImageLibraryOptions | undefined = undefined
) => {
  const [imageUri, setImageUri] = useState<string | undefined>(initialImageUri);
  useEffect(() => setImageUri(initialImageUri), [initialImageUri]);

  return {
    imageUri,
    selectImage: () =>
      new Promise<string | undefined>((resolve) =>
        launchImageLibrary(
          {
            mediaType: 'photo',
            maxWidth: 1024,
            maxHeight: 1024,
            quality: 0.2,
            includeBase64: true,
            ...options
          },
          (response: ImagePickerResponse) => {
            if (response.assets?.[0]?.base64) {
              const imageUri = `data:image/jpeg;base64,${response.assets[0].base64}`;
              setImageUri(imageUri);
              resolve(imageUri);
            }
          }
        )
      ),
    clearImage: () => setImageUri(undefined)
  };
};
