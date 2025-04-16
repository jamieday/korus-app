#import "SpotifyIos.h"
#import <React/RCTEventEmitter.h>
#import <UIKit/UIKit.h>

@interface SpotifyIos () <SPTAppRemoteDelegate, SPTAppRemotePlayerStateDelegate>

@property (nonatomic, strong) SPTAppRemote *appRemote;

@end

@implementation SpotifyIos

RCT_EXPORT_MODULE()

- (instancetype)init {
  if (self = [super init]) {
    [[NSNotificationCenter defaultCenter] addObserver:self
                                           selector:@selector(applicationWillResignActive:)
                                               name:UIApplicationWillResignActiveNotification
                                             object:nil];
    
    [[NSNotificationCenter defaultCenter] addObserver:self
                                           selector:@selector(applicationDidBecomeActive:)
                                               name:UIApplicationDidBecomeActiveNotification
                                             object:nil];
  }
  return self;
}

- (void)dealloc {
  [[NSNotificationCenter defaultCenter] removeObserver:self];
}

- (void)applicationWillResignActive:(NSNotification *)notification {
  if (self.appRemote.isConnected) {
    [self.appRemote disconnect];
  }
}

- (void)applicationDidBecomeActive:(NSNotification *)notification {
  if (self.appRemote.connectionParameters.accessToken) {
    [self.appRemote connect];
  }
}

- (NSArray<NSString *> *)supportedEvents {
  return @[@"playerStateChanged", @"connectionStateChanged"];
}

RCT_EXPORT_METHOD(initialize) {
  SPTConfiguration *spotifyConfig = [[SPTConfiguration alloc] initWithClientID:spotifyConfig[@"clientID"]
                                                                redirectURL:[NSURL URLWithString:spotifyConfig[@"redirectURL"]]];
  spotifyConfig.tokenSwapURL = [NSURL URLWithString:spotifyConfig[@"tokenSwapURL"]];
  spotifyConfig.tokenRefreshURL = [NSURL URLWithString:spotifyConfig[@"tokenRefreshURL"]];
  spotifyConfig.playURI = @"";
  
  self.appRemote = [[SPTAppRemote alloc] initWithConfiguration:spotifyConfig logLevel:SPTAppRemoteLogLevelDebug];
  self.appRemote.delegate = self;
  self.appRemote.playerAPI.delegate = self;
}

RCT_EXPORT_METHOD(connect:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  [self.appRemote connect];
  resolve(nil);
}

RCT_EXPORT_METHOD(disconnect) {
  [self.appRemote disconnect];
}

RCT_EXPORT_METHOD(playUri:(NSString *)uri) {
  [self.appRemote.playerAPI play:uri asRadio:NO callback:^(id  _Nullable result, NSError * _Nullable error) {
    if (error) {
      NSLog(@"Error playing track: %@", error);
    }
  }];
}

RCT_EXPORT_METHOD(pause) {
  [self.appRemote.playerAPI pause:nil];
}

RCT_EXPORT_METHOD(resume) {
  [self.appRemote.playerAPI resume:nil];
}

RCT_EXPORT_METHOD(seek:(NSInteger)positionMs) {
  [self.appRemote.playerAPI seekTo:positionMs callback:nil];
}

RCT_EXPORT_METHOD(isConnected:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  resolve(@(self.appRemote.isConnected));
}

#pragma mark - SPTAppRemoteDelegate

- (void)appRemoteDidEstablishConnection:(SPTAppRemote *)appRemote {
  [appRemote.playerAPI subscribeToPlayerState:^(id  _Nullable result, NSError * _Nullable error) {
    if (error) {
      NSLog(@"Error subscribing to player state: %@", error);
    }
  }];
  
  [self sendEventWithName:@"connectionStateChanged" body:@{
    @"connected": @YES,
    @"error": [NSNull null]
  }];
}

- (void)appRemote:(SPTAppRemote *)appRemote didDisconnectWithError:(NSError *)error {
  NSLog(@"Disconnected from Spotify: %@", error);
  
  [self sendEventWithName:@"connectionStateChanged" body:@{
    @"connected": @NO,
    @"error": error ? @{
      @"code": @(error.code),
      @"domain": error.domain,
      @"description": error.localizedDescription
    } : [NSNull null]
  }];
}

- (void)appRemote:(SPTAppRemote *)appRemote didFailConnectionAttemptWithError:(NSError *)error {
  NSLog(@"Failed to connect to Spotify: %@", error);
  
  [self sendEventWithName:@"connectionStateChanged" body:@{
    @"connected": @NO,
    @"error": @{
      @"code": @(error.code),
      @"domain": error.domain,
      @"description": error.localizedDescription
    }
  }];
}

#pragma mark - SPTAppRemotePlayerStateDelegate

- (void)playerStateDidChange:(id<SPTAppRemotePlayerState>)playerState {
  NSDictionary *state = @{
    @"isPaused": @(playerState.isPaused),
    @"playbackPosition": @(playerState.playbackPosition),
    @"track": @{
      @"uri": playerState.track.uri,
      @"name": playerState.track.name,
      @"artist": @{
        @"name": playerState.track.artist.name
      },
      @"duration": @(playerState.track.duration)
    }
  };
  
  [self sendEventWithName:@"playerStateChanged" body:state];
}

@end 