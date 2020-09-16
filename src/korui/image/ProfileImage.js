import { Image } from './Image';
import { colors } from '../../styles';
import React from 'react';

export const ProfileImage = ({ source, size }) => (
  <Image
    source={source}
    style={{
      width: size,
      aspectRatio: 1,
      borderWidth: 1,
      borderColor: colors.white,
      borderRadius: size / 2,
    }}
  />
);
