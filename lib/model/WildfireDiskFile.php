<?
class WildfireDiskFile{

  public static $hash_length = 6;
  public static $name = "Local storage";
  /**
   * this should handle the saving of the media to the disc
   **/
  public function set($media_item){
    if($media_item){
      //set to 0, so unpublished
      $media_item->update_attributes(array('status'=>0));
      //the disk file has very little to do, just update with information about the file:
      $file = PUBLIC_DIR.$media_item->uploaded_location;
      if(is_readable($file)) return $media_item->update_attributes(array('status'=>1, 'source'=>$media_item->uploaded_location, 'media_class'=>get_class($this), 'media_type'=>self::$name));
    }
    return false;
  }
  //should return a url to display the image
  public function get($media_item, $size=false){
    if(WildfireDiskFile::$hash_length) $hash = substr($media_item->hash, 0, WildfireDiskFile::$hash_length);
    else $hash = $media_item->hash;
    //if its not an image, return the normal url anyway
    if($size === false || !strstr($media_item->file_type, "image")) return "/".trim($media_item->source, "/");
    //we'll make a new controller called M (for media) which will simply map things smartly
    else return "/m/".$hash."/".$size.".".$media_item->ext;
  }

  //this will actually render the contents of the image
  public function show($media_item, $size=false){
    //if its not an image, then spit out the file contents with correct headers
    if(!strstr($media_item->file_type, "image") || $size == "full") return File::display_asset(PUBLIC_DIR.$media_item->source, $media_item->file_type);
    if(!$size) $size = 100; //default size

    if(WildfireDiskFile::$hash_length) $hash = substr($media_item->hash, 0, WildfireDiskFile::$hash_length);
    else $hash = $media_item->hash;

    $dir = CACHE_DIR."images/".$hash."/";
    $apache_dir = PUBLIC_DIR."m/".$hash."/";
    $cache_file = $dir . $size .".".$media_item->ext;
    $apache_file = $apache_dir . $size .".".$media_item->ext;
    if(!is_readable($dir)) mkdir($dir, 0777, true);
    if(!is_readable($apache_dir)) mkdir($apache_dir, 0777, true);
    if(!is_readable($apache_file)) File::smart_resize_image(PUBLIC_DIR.$media_item->source, $apache_file, $size, false, "nocrop");
    if(!is_readable($cache_file)) File::smart_resize_image(PUBLIC_DIR.$media_item->source, $cache_file, $size, false, "nocrop");

    File::display_image($cache_file);
  }
  //generates the tag to be displayed - return generic icon if not an image
  public function render($media_item, $size, $title="preview", $class=""){
    if(!strstr($media_item->file_type, "image")) return "<img src='/images/wildfire/themes/v2/files_document.png' alt='".$title."' class='".$class."'>";
    else return "<img src='".$this->get($media_item, $size)."' alt='".$title."' class='".$class."'>";
  }

  //find the folders on the file system to sync with
  public function sync_locations(){
    $locations = array();
    $folder = PUBLIC_DIR ."files/";
    $dir = new RecursiveIteratorIterator(new RecursiveRegexIterator(new RecursiveDirectoryIterator($folder, RecursiveDirectoryIterator::FOLLOW_SYMLINKS), '#^[^\.]*$#i'), true);
    foreach($dir as $file){
      $path = $file->getPathName();
      $locations[$path] = array('value'=>str_replace(PUBLIC_DIR, "", $path), 'label'=>basename($path));
    }
    return $locations;
  }
  /**
   * a sync option will be added to the cms via event
   * that page will let you pick what sync types are allowed (ie a drop down of classes -> self::$name)
   * the called event (cms.$model.sync.$x) will return set of options to sync with (file system would be folder, flickr would be sets etc)
   * the confirmed sync will then run this
   */
  public function sync($location){
    $info = array();
    $ids = array();
    $folder = PUBLIC_DIR ."/".$location;
    $exts = array();
    $class = get_class($this);
    foreach(WildfireMedia::$allowed as $e=>$c) if($c == $class) $exts[] = $e;
    $extstr = "(".implode("|", $exts).")";
    $dir = new RecursiveIteratorIterator(new RecursiveRegexIterator(new RecursiveDirectoryIterator($folder, RecursiveDirectoryIterator::FOLLOW_SYMLINKS), '#(?<!/)\.'.$extstr.'$|^[^\.]*$#i'), true);
    foreach($dir as $file){
      $media = new WildfireMedia;
      $path = $file->getPathName();
      $source = str_replace(PUBLIC_DIR, "", $path);
      $ext = strtolower(substr(strrchr($path,'.'),1));
      if($found = $media->filter("source", $source)->first()){
        $found = $found->update_attributes(array('status'=>1));
      }else{
        $found = $media->update_attributes(array('source'=>$source,
                                                  'uploaded_location'=>$source,
                                                  'status'=>1,
                                                  'sync_location'=>$location,
                                                  'media_class'=>$class,
                                                  'media_type'=>self::$name,
                                                  'ext'=>$ext,
                                                  'file_type'=>mime_content_type($path),
                                                  'title'=>basename($path),
                                                  'hash'=> hash_hmac('sha1', $data, md5(file_get_contents($path)) )
                                                  ));
      }
      $ids[] = $found->primval;
      $info[] = $found;
    }

    //now look at the db for ones that might be missing
    $media = new WildfireMedia;
    foreach($ids as $i) $media->filter("id", $i, "!=");
    foreach($media->filter("status", 1)->filter("media_class", $class)->filter("sync_location", $location)->all() as $r) if(!is_readable(PUBLID_DIR.$r->source)) $r->update_attributes(array('status',-1));

    return $info;
  }


}
?>