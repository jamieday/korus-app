const { withInfoPlist, withDangerousMod } = require('@expo/config-plugins');
const {
  mergeContents,
} = require('@expo/config-plugins/build/utils/generateCode');
const fs = require('fs');
const path = require('path');

function withSpotifyIos(config, props) {
  // Add Spotify pod and linker flags
  config = withDangerousMod(config, [
    'ios',
    async (config) => {
      const filePath = path.join(
        config.modRequest.platformProjectRoot,
        'Podfile',
      );
      const contents = fs.readFileSync(filePath, 'utf-8');

      // Add Spotify pod
      const newContents = mergeContents({
        tag: 'spotify-ios-pod',
        src: contents,
        newSrc: `  pod 'SpotifyiOS', '~> 1.2.3'`,
        anchor: /use_expo_modules!/,
        offset: 1,
        comment: '#',
      }).contents;

      // Add -ObjC linker flag
      const finalContents = mergeContents({
        tag: 'spotify-ios-linker-flag',
        src: newContents,
        newSrc: `  post_install do |installer|
    installer.pods_project.targets.each do |target|
      target.build_configurations.each do |config|
        config.build_settings['OTHER_LDFLAGS'] = '$(inherited) -ObjC'
        config.build_settings['SWIFT_OBJC_BRIDGING_HEADER'] = '${config.modRequest.projectName}-Bridging-Header.h'
      end
    end
  end`,
        anchor: /post_install/,
        offset: 0,
        comment: '#',
      }).contents;

      fs.writeFileSync(filePath, finalContents);

      // Create or append to bridging header
      const bridgingHeaderPath = path.join(
        config.modRequest.platformProjectRoot,
        `${config.modRequest.projectName}-Bridging-Header.h`,
      );

      const bridgingHeaderContent = `#import <SpotifyiOS/SpotifyiOS.h>\n`;

      if (fs.existsSync(bridgingHeaderPath)) {
        const existingContent = fs.readFileSync(bridgingHeaderPath, 'utf-8');
        if (!existingContent.includes('#import <SpotifyiOS/SpotifyiOS.h>')) {
          fs.appendFileSync(bridgingHeaderPath, bridgingHeaderContent);
        }
      } else {
        fs.writeFileSync(bridgingHeaderPath, bridgingHeaderContent);
      }

      // Inject configuration into SpotifyIos.m
      const spotifyIosPath = path.join(
        config.modRequest.platformProjectRoot,
        'Pods',
        'SpotifyIos',
        'SpotifyIos.m',
      );

      if (fs.existsSync(spotifyIosPath)) {
        const spotifyConfig = {
          clientID: props.clientId,
          redirectURL: props.redirectUrl,
          tokenSwapURL: props.tokenSwapUrl,
          tokenRefreshURL: props.tokenRefreshUrl,
          scopes: props.scopes,
        };

        const spotifyConfigStr = JSON.stringify(spotifyConfig, null, 2);
        const spotifyConfigCode = `static NSDictionary *spotifyConfig = ${spotifyConfigStr};\n\n`;

        let spotifyContents = fs.readFileSync(spotifyIosPath, 'utf-8');
        spotifyContents = spotifyContents.replace(
          '@implementation SpotifyIos',
          `${spotifyConfigCode}@implementation SpotifyIos`,
        );

        fs.writeFileSync(spotifyIosPath, spotifyContents);
      }

      return config;
    },
  ]);

  // Add Info.plist entries
  config = withInfoPlist(config, (config) => {
    // Add LSApplicationQueriesSchemes
    if (!config.modResults.LSApplicationQueriesSchemes) {
      config.modResults.LSApplicationQueriesSchemes = [];
    }
    if (!config.modResults.LSApplicationQueriesSchemes.includes('spotify')) {
      config.modResults.LSApplicationQueriesSchemes.push('spotify');
    }

    // Add CFBundleURLTypes
    if (!config.modResults.CFBundleURLTypes) {
      config.modResults.CFBundleURLTypes = [];
    }

    const redirectUrl = new URL(props.redirectUrl);
    const urlScheme = redirectUrl.protocol.replace(':', '');

    const existingUrlType = config.modResults.CFBundleURLTypes.find(
      (type) =>
        type.CFBundleURLName === props.bundleIdentifier ||
        config.ios?.bundleIdentifier,
    );

    if (existingUrlType) {
      if (!existingUrlType.CFBundleURLSchemes.includes(urlScheme)) {
        existingUrlType.CFBundleURLSchemes.push(urlScheme);
      }
    } else {
      config.modResults.CFBundleURLTypes.push({
        CFBundleURLSchemes: [urlScheme],
        CFBundleURLName: props.bundleIdentifier || config.ios?.bundleIdentifier,
      });
    }

    return config;
  });

  // Add AppDelegate modification for URL handling
  config = withDangerousMod(config, [
    'ios',
    async (config) => {
      const appDelegatePath = path.join(
        config.modRequest.platformProjectRoot,
        'AppDelegate.mm',
      );

      if (fs.existsSync(appDelegatePath)) {
        const appDelegateContent = fs.readFileSync(appDelegatePath, 'utf-8');

        const newAppDelegateContent = appDelegateContent.replace(
          '@implementation AppDelegate',
          `#import "SpotifyIos.h"

@implementation AppDelegate

- (BOOL)application:(UIApplication *)app openURL:(NSURL *)url options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options {
  if ([SpotifyIos handleAuthCallback:url]) {
    return YES;
  }
  return [super application:app openURL:url options:options];
}

`,
        );

        fs.writeFileSync(appDelegatePath, newAppDelegateContent);
      }

      return config;
    },
  ]);

  return config;
}

module.exports = withSpotifyIos;
