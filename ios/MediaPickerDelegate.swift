import MediaPlayer

class MediaPickerDelegate: NSObject, MPMediaPickerControllerDelegate {
  var onMediaItemsSelected:(MPMediaItemCollection)->()
  var onDismiss:()->()

  func mediaPickerDidCancel(_ mediaPicker: MPMediaPickerController) {
    print("Oh canceled.")
//    self.onDismiss()
  }

  func mediaPicker(
    _ mediaPicker: MPMediaPickerController,
    didPickMediaItems mediaItemCollection: MPMediaItemCollection) {
      print("OK!")
//      self.onMediaItemsSelected(mediaItemCollection)
      print("you picked: \(mediaItemCollection)")
  }
  
  init(
    onMediaItemsSelected:@escaping (MPMediaItemCollection)->(),
    onDismiss:@escaping ()->()
    ) {
    self.onMediaItemsSelected = onMediaItemsSelected;
    self.onDismiss = onDismiss;
  }
}

