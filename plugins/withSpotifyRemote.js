const { withDangerousMod } = require('@expo/config-plugins');
const {
  mergeContents,
} = require('@expo/config-plugins/build/utils/generateCode');
const fs = require('fs');
const path = require('path');

const withSpotifyRemote = (config) => {
  return withDangerousMod(config, [
    'ios',
    async (config) => {
      const filePath = path.join(
        config.modRequest.platformProjectRoot,
        config.modRequest.projectName,
        'AppDelegate.mm',
      );
      let contents = fs.readFileSync(filePath, 'utf-8');

      // Add import after Firebase import
      const importResult = mergeContents({
        tag: 'import-spotify-remote',
        src: contents,
        newSrc: '#import <RNSpotifyRemote.h>',
        anchor: '#import "AppDelegate.h"',
        offset: 1,
        comment: '//',
      });

      if (!importResult.didMerge) {
        console.warn('Could not add Spotify Remote import');
      }
      contents = importResult.contents;

      // Add Spotify URL handling in the openURL method
      const methodResult = mergeContents({
        tag: 'open-url-spotify-remote',
        src: contents,
        newSrc: `
  if ([url.scheme isEqualToString:@"spotify"]) {
    return [[RNSpotifyRemoteAuth sharedInstance] application:application openURL:url options:options];
  }`,
        anchor: '// Linking API',
        offset: 2,
        comment: '//',
      });

      if (!methodResult.didMerge) {
        console.warn('Could not add Spotify URL handling');
      }
      contents = methodResult.contents;

      fs.writeFileSync(filePath, contents);

      return config;
    },
  ]);
};

module.exports = withSpotifyRemote;
