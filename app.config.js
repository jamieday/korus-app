const IS_DEV = process.env.APP_VARIANT === 'development';
const IS_PREVIEW = process.env.APP_VARIANT === 'preview';

export default ({ config }) => ({
  ...config,
  name: getAppName(),
  ios: {
    ...config.ios,
    bundleIdentifier: getUniqueIdentifier()
  },
  android: {
    ...config.android,
    package: getUniqueIdentifier()
  },
  plugins: [
    ...config.plugins,
    [
      '../expo-spotify/app.plugin.js',
      {
        clientId: '478eb84f217c4dd79145a565bffd07ee',
        redirectUrl: 'korus://spotify-login-callback',
        tokenSwapUrl: `${process.env.EXPO_PUBLIC_API_HOST}/spotify/swap`,
        tokenRefreshUrl: `${process.env.EXPO_PUBLIC_API_HOST}/spotify/refresh`,
        bundleIdentifier: 'app.korus',
        scopes: [
          'streaming',
          'user-read-email',
          'user-read-private',
          'user-read-playback-state',
          'user-modify-playback-state'
        ]
      }
    ]
  ]
});

const getUniqueIdentifier = () => {
  if (IS_DEV) {
    return 'app.korus.dev';
  }

  if (IS_PREVIEW) {
    return 'app.korus.preview';
  }

  return 'app.korus';
};

const appName = 'Korus';
const getAppName = () => {
  if (IS_DEV) {
    return appName + ' (Dev)';
  }

  if (IS_PREVIEW) {
    return appName + ' (Preview)';
  }

  return appName;
};
