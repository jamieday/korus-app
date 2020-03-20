import StoreKit
import MediaPlayer

//import RCTConvert
//import RCTImageStoreManager
//import RCTRootView
//import RCTUtils

@available(iOS 9.3, *)
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
  


  var resolver: RCTPromiseResolveBlock? = nil;
  var rejecter: RCTPromiseRejectBlock? = nil;
  
  func mediaPicker(
    _ mediaPicker: MPMediaPickerController,
    didPickMediaItems mediaItemCollection: MPMediaItemCollection) {
    print("OK!")
    print("you picked: \(mediaItemCollection)")
    let selectedItem = mediaItemCollection.representativeItem!
    var itemJson: Dictionary<String, String> = [:]
    if #available(iOS 10.3, *) {
      itemJson = [
        "title":           selectedItem.title!,
        "artist":          selectedItem.artist!,
        "playbackStoreId": selectedItem.playbackStoreID,
      ]
    } else {
      self.rejecter?(nil, "This feature is only available in iOS 10.3+.", nil);
    }
    print(itemJson)
    self.resolver?(itemJson)
    mediaPicker.dismiss(animated: true, completion: nil)
  }
  
  @available(iOS 10.3, *)
  @objc func selectSong(_ resolve: @escaping RCTPromiseResolveBlock,
                        rejecter reject: @escaping RCTPromiseRejectBlock) {
    let controller = MPMediaPickerController(mediaTypes: .music)
    controller.allowsPickingMultipleItems = false
    controller.prompt = "Promote a song"
    
    self.resolver = resolve;
    self.rejecter = reject;
    controller.delegate = self//mediaPickerDelegate
    
    let rootViewController = RCTPresentedViewController()
    rootViewController!.present(controller, animated: true, completion: nil)
  }
  
  @available(iOS 10.3, *)
  @objc func playMusic(_ playbackStoreId: String) {
    // Instantiate a new music player
    let myMediaPlayer = MPMusicPlayerApplicationController.systemMusicPlayer
    myMediaPlayer.repeatMode =  MPMusicRepeatMode.one
    
    let descriptor = MPMusicPlayerStoreQueueDescriptor(storeIDs: [playbackStoreId]);
//    let playbackStoreIdFilter =
//      MPMediaPropertyPredicate(value: playbackStoreId,
//                               forProperty: MPMediaItemPropertyPlaybackStoreID,
//                               comparisonType: .equalTo)
    
//    let filterSet = Set([playbackStoreIdFilter])
//    let query = MPMediaQuery(filterPredicates: filterSet)
    myMediaPlayer.setQueue(with: descriptor)
    myMediaPlayer.play()
  }
}
