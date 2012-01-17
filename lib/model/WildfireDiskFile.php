<?
class WildfireDiskFile{
  
  /**
   * this should handle the saving of the media to the disc
   **/
  public function set($media_item){  
    if($media_item){
      //set to 0, so unpublished
      $media_item->update_attributes(array('status'=>0));
      //the disk file has very little to do, just update with information about the file:
      $file = PUBLIC_DIR.$media_item->uploaded_location;
      if(is_readable($file)) return $media_item->update_attributes(array('status'=>1, 'source'=>$media_item->uploaded_location, 'media_class'=>get_class($this)));
    }
    return false;
  }

  public function get($media_item){
    
  }

  public function show($media_item){
    
  }


}
?>