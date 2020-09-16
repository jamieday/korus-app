import ImagePicker from 'react-native-image-picker';
import { useState } from 'react';

export const useImagePicker = (
  initialImageUri = undefined,
  options = undefined,
) => {
  const [imageUri, setImageUri] = useState(initialImageUri);

  return {
    imageUri,
    selectImage: () =>
      new Promise((resolve) =>
        ImagePicker.showImagePicker(
          {
            mediaType: 'photo',
            maxWidth: 1024,
            maxHeight: 1024,
            quality: 0.2,
            title: options?.title,
          },
          (response) => {
            if (response.data) {
              const imageUri = `data:image/jpeg;base64,${response.data}`;
              setImageUri(imageUri);
              resolve(imageUri);
            }
          },
        ),
      ),
    clearImage: () => setImageUri(undefined),
  };
};
