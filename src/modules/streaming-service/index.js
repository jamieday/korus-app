/* eslint-disable import/prefer-default-export */
import React, { useContext } from 'react';
import * as AppleMusic from './apple-music';
import * as Spotify from './spotify';

export const findService = (key) => {
  switch (key) {
    case AppleMusic.uniqueKey:
      return AppleMusic;
    case Spotify.uniqueKey:
      return Spotify;
    default:
      throw new Error(`unknown streaming service ${key}`);
  }
};
