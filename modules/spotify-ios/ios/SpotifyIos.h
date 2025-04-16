#import <ExpoModulesCore/EXExportedModule.h>
#import <ExpoModulesCore/EXModuleRegistryConsumer.h>
#import <SpotifyiOS/SpotifyiOS.h>

@interface SpotifyIos : EXExportedModule <EXModuleRegistryConsumer, SPTAppRemoteDelegate, SPTAppRemotePlayerStateDelegate>

@end 