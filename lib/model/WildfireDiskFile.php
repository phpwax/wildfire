<?
class WildfireDiskFile{
  
  public static $hash_length = 6;
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
  //should return a url to display the image 
  public function get($media_item, $size=false){
    if(WildfireDiskFile::$hash_length) $hash = substr($media_item->hash, 0, WildfireDiskFile::$hash_length);
    else $hash = $media_item->hash;
    
    if($size === false) return "/".$media_item->source;
    //we'll make a new controller called M (for media) which will simply map things smartly
    else return "/m/".$hash."/".$size.".".$media_item->ext;
  }

  //this will actually render the contents of the image
  public function show($media_item, $size=false){
    if(!$size) $size = 100; //default size
    $dir = CACHE_DIR."images/".$media_item->hash."/";
    $cache_file = $dir . $size .".".$media_item->ext;    
    if(!is_readable($dir)) mkdir($dir, 0777, true);
    if(!is_readable($cache_file)){
      File::smart_resize_image(PUBLIC_DIR.$media_item->source, $cache_file, $size, false, "nocrop");
    }         
    File::display_image($cache_file);    
  }

  public function sync($media_item){
    
  }


}
?>