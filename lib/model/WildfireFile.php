<?php

class WildfireFile extends WaxModel {

  public $primary_options = array("auto"=>false);
  public static $queue_images = false;
  public static $image_sizes = array();
  public $_row_cache = false;
  
  public function setup() {
    $this->define("filename", "CharField");
    $this->define("path", "CharField");
    $this->define("rpath", "CharField");
    $this->define("type", "CharField");
    $this->define("downloads", "IntegerField");
    $this->define("status", "CharField", array("choices"=>array("lost", "found") ));
    $this->define("uploader", "IntegerField");
    $this->define("description", "TextField");
    $this->define("date", "DateTimeField");
    $this->define("size", "IntegerField");
		$this->define("attached_to", "ManyToManyField", array('target_model'=>"WildfireContent", 'editable'=>false));
  }
  
  public function scope_available() {
    return $this->filter("status", "found");
  }
  
  
  
	public function extension() {
	  return ".".File::get_extension($this->filename);
	}

  public function url(){ return "/".$this->rpath.$this->filename;}
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
	  if(!is_readable($this->path.'/'.$this->filename)) return false;
	  if($info = @getimagesize($this->path.'/'.$this->filename)) return $info[0];
	  return $this->tryffmpeg("width");
	  return false;
	}
	public function height() {
	  if(!is_readable($this->path.'/'.$this->filename)) return false;
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
	
	public function before_save() {
	  $res = $this->filter(array($this->primary_key => $params))->first();
	  $this->_row_cache = $res->row;
	}
	
	public function after_save() {
	  if($this->rpath !== $this->_row_cache->rpath) {
	    $this->handle_move();
	  }
	}
	
	public function handle_move() {
    $path = PUBLIC_DIR. $this->rpath;
    $new_filename = $path.File::safe_file_save($path, $this->filename);
    rename(PUBLIC_DIR.$this->_row_cache["rpath"].$this->filename, $new_filename);
	}
	
}





