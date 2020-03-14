import StoreKit
import MediaPlayer

//import RCTConvert
//import RCTImageStoreManager
//import RCTRootView
//import RCTUtils

@available(iOS 9.3, *)
@objc(AppleMusic)
class AppleMusic: NSObject {
  
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
  
  @available(iOS 10.3, *)
  @objc func requestUserToken(_ developerToken: String,
                              resolver resolve: @escaping RCTPromiseResolveBlock,
                              rejecter reject: @escaping RCTPromiseRejectBlock) {
    let controller = SKCloudServiceController();
    
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
  
  @objc func selectSong(_ resolve: @escaping RCTPromiseResolveBlock,
                        rejecter reject: @escaping RCTPromiseRejectBlock) {
    let controller = MPMediaPickerController(mediaTypes: .music)
    controller.allowsPickingMultipleItems = false
    //    controller.popoverPresentationController?.sourceView = rootViewController
    let mediaPickerDelegate = MediaPickerDelegate(didPickMediaItems: { response in
        resolve(response)
    })
    controller.delegate = mediaPickerDelegate
    
    let rootViewController = RCTPresentedViewController()
    rootViewController!.present(controller, animated: true)
  }
  
  @available(iOS 10.3, *)
  @objc func playMusic(_ ids: [String]) {
    // Instantiate a new music player
    let myMediaPlayer = MPMusicPlayerApplicationController.applicationQueuePlayer
    myMediaPlayer.repeatMode =  MPMusicRepeatMode.one
    // Add a playback queue containing all songs on the device
    myMediaPlayer.setQueue(with: ids)
    // Start playing from the beginning of the queue
    myMediaPlayer.play()
  }
}
