/* eslint-disable import/prefer-default-export */
import React from 'react';
import * as AppleMusic from './apple-music';
import * as Spotify from './spotify';

export const StreamingServiceContext = React.createContext();

export const usePlayer = () => {
  return undefined;
};

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

export const useStreamingService = () => {
  const context = React.useContext(StreamingServiceContext);
  if (!context) {
    return undefined;
  }
  return {
    service: findService(context.key),
    context,
  };
};
