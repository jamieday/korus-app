#import "React/RCTBridgeModule.h"

@interface RCT_EXTERN_MODULE(AppleMusic, NSObject)

RCT_EXTERN_METHOD(requestPermission:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject
                  )

RCT_EXTERN_METHOD(requestUserToken:(NSString *)developerToken
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(selectSong:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(playMusic:(NSString *)id)

@end
