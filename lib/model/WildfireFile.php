<?php

class WildfireFile extends WaxModel {

  public $primary_options = array("auto"=>false);
  public static $queue_images = false;
  public static $image_sizes = array();
  
  public function setup() {
    $this->define("filename", "CharField");
    $this->define("path", "CharField");
    $this->define("rpath", "CharField");
    $this->define("type", "CharField");
    $this->define("downloads", "IntegerField");
    $this->define("status", "CharField", array(
        "choices"=>array("lost", "found")
      ));
    $this->define("uploader", "IntegerField");
    $this->define("description", "TextField");
    $this->define("date", "DateTimeField");
    $this->define("size", "IntegerField");
		$this->define("attached_to", "ManyToManyField", array('target_model'=>"CmsContent", 'editable'=>false));
  }
  
  public function scope_available() {
    $this->filter(array("status"=>"found"));
  }
  
  
  public function find_filter_images($filter, $limit = false) {
    $params = array("conditions"=>"type LIKE '%image%' AND (id LIKE '%$filter%' OR filename LIKE '%$filter%' OR description LIKE '%$filter%')");
    if($limit) $params['limit']=$limit;
	  return $this->find_all($params);
	}
	
	public function find_all_images($params=array()) {
    if($params["conditions"]) $params["conditions"].=" AND type LIKE '%image%'";
    else $params["conditions"] = "type LIKE '%image%'";
	  return $this->find_all($params);
	}
	public function flash_files(){
		$model = new WildfireFile();
		return $model->filter(array("status"=>"found"))->filter("`filename` LIKE '%.swf'")->all();
	}
	
	public function extension() {
	  return ".".File::get_extension($this->filename);
	}
	
	public function find_all_files() {
		$model = new WildfireFile();
	  return $model->filter(array("status"=>"found"))->filter("type NOT LIKE '%image%'")->all();
	}
	
	public function scan_full_filelist(){
	  $filearray = array();
		$fs = new CmsFilesystem();
		$base_dir = $fs->defaultFileStore.$fs->relativepath;
		$dir = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($base_dir), true);
		foreach ( $dir as $file ) {
      if(substr($dir->getFilename(),0,1) != "."){
        $filearray[]=array("path"=>str_replace($base_dir,"",$file->getPathname()), "filename"=>str_repeat('&nbsp;&nbsp;', $dir->getDepth()+1).$file->getFilename(), "is_file"=>$file->isFile());
      }
		}
		return $filearray;
		return File::list_filesystem_recursive($dir);
	}
	
	public function url() {
	  return "/".$this->rpath."/".$this->filename;
	}	
	
	public function folder_options($selected = false){
		$fs = new CmsFilesystem();
		$dir = $fs->defaultFileStore.$fs->relativepath;
		$options = content_tag("option", "Your Folder", array("value"=>$fs->relativepath, "selected"=>"selected"));
		$folders = File::get_folders($dir);

		if(is_array($folders)){
  	 	foreach($folders as $folder) {
  	    $path = str_replace(PUBLIC_DIR, "", $folder["path"]);
  	    $options .= content_tag("option", $folder["name"], array("value"=>$path));
  	  }
    }
		return $options;
	}
	
	/**
	 * permalink function returns the path to the show image function
	 * @return string url
	 * @param string $size 
	 */	
	public function permalink($size=110){
		$ext = File::get_extension($this->filename);		
		return "/show_image/".$this->id."/".$size.".".$ext;
	}
	/**
	 * show function - this is now moved from the contoller level so can differ for each model
	 * NOTE: this function exits
	 * @param string $size 
	 */	
	public function show($size=110, $compress = false){
		$source = PUBLIC_DIR. $this->rpath."/".$this->filename;    
		$extension = File::get_extension($this->filename);
		if(!is_dir(CACHE_DIR."images/")){
		  @mkdir(CACHE_DIR."images/");
		  @chmod(CACHE_DIR."images/",0777);
		}
		$file = CACHE_DIR."images/".$this->id."_".$size . ".".$extension;
		//slash any spaces
    if(!is_readable($source)) WaxLog::log('error', "[image] FATAL IMAGE ERROR - ".$source);
		
		
    if(!is_file($file) || !is_readable($file)) {
      if(self::$queue_images) {
        $q = new ImageQueue;
        $q->original = $source;
        $q->destination = $file;
        $q->size = $size;
        $q->compression = $compression;
        $q->save();
        File::display_image(PLUGIN_DIR."cms/resources/public/images/cms/indicator.gif");
  		} else File::resize_image($source, $file, $size, $compression);
    }
		if($this->image = File::display_image($file) ) {
			return true;
		} return false;
	}
	
	public function is_image() {
	  return strpos($this->type,"image") !==false;
	}
	
	public function width() {
	  if($info = @getimagesize($this->path.'/'.$this->filename)) return $info[0];
	  return $this->tryffmpeg("width");
	  return false;
	}
	public function height() {
	  if($info = @getimagesize($this->path.'/'.$this->filename)) return $info[1];
	  return $this->tryffmpeg("height");
	  return false;
	}
	
	public function tryffmpeg($dim) {
	  $command = "/usr/bin/ffmpeg -i \"".$this->path.'/'.$this->filename. "\" 2>&1";
	  ob_start();
    passthru($command);
    $size = ob_get_contents();
    ob_end_clean();
    preg_match('/(\d{2,4})x(\d{2,4})/', $size, $matches);
    if($dim=="width") return $matches[1];
    if($dim=="height") return $height = $matches[2];
    return false;
	}
	
}