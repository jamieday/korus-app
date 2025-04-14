const { withSpotifyRemote } = require('./plugins/withSpotifyRemote');

const IS_DEV = process.env.APP_VARIANT === 'development';
const IS_PREVIEW = process.env.APP_VARIANT === 'preview';

export default ({ config }) => ({
  ...config,
  name: getAppName(),
  ios: {
    ...config.ios,
    bundleIdentifier: getUniqueIdentifier(),
  },
  android: {
    ...config.android,
    package: getUniqueIdentifier(),
  },
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
