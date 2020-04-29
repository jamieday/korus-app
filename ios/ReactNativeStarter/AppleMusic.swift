import StoreKit
import MediaPlayer

@objc(AppleMusic)
class AppleMusic: NSObject, MPMediaPickerControllerDelegate {
  
  @objc static func requiresMainQueueSetup() -> Bool {
    return true
  }
  
  @objc func requestPermission(_ resolve: @escaping RCTPromiseResolveBlock,
                               rejecter reject: @escaping RCTPromiseRejectBlock) {
    SKCloudServiceController.requestAuthorization { (status:SKCloudServiceAuthorizationStatus) in
      switch status {
      case .authorized: resolve("ok")
      case .denied: resolve("denied")
      case .notDetermined: resolve("not determined")
      case .restricted: resolve("restricted")
      }
    }
  }
  
  @objc func requestUserToken(_ developerToken: String,
                              resolver resolve: @escaping RCTPromiseResolveBlock,
                              rejecter reject: @escaping RCTPromiseRejectBlock) {
    let controller = SKCloudServiceController()
    
    let completionHandler = { (userToken: String?, error: Error?) in
      if userToken == nil {
        resolve(["isError": true, "error": "denied"])
      } else {
        resolve(["isError": false, "result": userToken!])
      }
    }
    if #available(iOS 11.0, *) {
      controller.requestUserToken(
        forDeveloperToken: developerToken,
        completionHandler: completionHandler)
    } else {
      controller.requestPersonalizationToken(
        forClientToken: developerToken,
        withCompletionHandler: completionHandler)
    }
  }
 
  let myMediaPlayer = MPMusicPlayerController.applicationMusicPlayer

  @objc func playSong(_ playbackStoreId: String) {
    if (myMediaPlayer.nowPlayingItem?.playbackStoreID != playbackStoreId) {
        myMediaPlayer.repeatMode =  MPMusicRepeatMode.none
        myMediaPlayer.setQueue(with: [playbackStoreId])
    }
    myMediaPlayer.play()
  }

  @objc func pauseSong() {
    myMediaPlayer.pause();
  }
}
