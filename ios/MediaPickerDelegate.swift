import MediaPlayer

class MediaPickerDelegate: NSObject, MPMediaPickerControllerDelegate {
  var didPickMediaItems:(MPMediaItemCollection)->()
  
  func mediaPicker(_: MPMediaPickerController, didPickMediaItems: MPMediaItemCollection) {
    self.didPickMediaItems(didPickMediaItems)
  }
  
  init(
    didPickMediaItems:@escaping (MPMediaItemCollection)->()
    ) {
    self.didPickMediaItems = didPickMediaItems
  }
}

