import React from 'react';

const initialState = { key: 'ready' };

export const PlaybackContext = React.createContext(initialState);

const playbackReducer = (prevState, action) => {
  switch (action.type) {
    case 'play':
      return { key: 'playing', songId: action.songId };
    case 'pause':
      if (prevState.key !== 'playing') {
        return prevState;
      }
      return { key: 'paused', songId: prevState.songId };
    default:
      throw new Error('Unhandled playback action');
  }
};

export const PlaybackContextProvider = ({ children }) => {
  const [playbackState, dispatch] = React.useReducer(
    playbackReducer,
    initialState,
  );

  const playback = React.useMemo(
    () => ({
      playbackState,
      dispatch,
    }),
    [playbackState, dispatch],
  );

  return (
    <PlaybackContext.Provider value={playback}>
      {children}
    </PlaybackContext.Provider>
  );
};
