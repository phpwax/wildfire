<?php

class WildfireFile extends WaxModel {

  public $primary_options = array("auto"=>false);
  
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
    $this->define("flags", "CharField", array(
        "choices"=>array("hot", "emergency", "normal")
      ));
    $this->define("description", "TextField");
    $this->define("date", "DateTimeField");
    $this->define("size", "IntegerField");
    $this->define("oldid", "IntegerField");
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
	
	public function url() {
	  return "/".$this->rpath."/".$this->filename;
	}	
	
	public function folder_options(){
		$fs = new CmsFilesystem();
		$dir = $fs->defaultFileStore.$fs->relativepath;
		$options = content_tag("option", "Your Folder", array("value"=>$fs->relativepath));
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
		$source=preg_replace("/[\s]/", "\ ", $source);
    if(!is_readable($source)) WaxLog::log('error', "[image] FATAL IMAGE ERROR - ".$source);
		if(!File::is_image($source)){
			if(!is_file($file) || !is_readable($file)) {
				$icon_type = $extension;
				$icon = PLUGIN_DIR."cms/resources/public/images/cms/"."cms-generic-icon-".strtolower($icon_type).".gif";
				if(!is_readable($icon) || $icon_file !=file_get_contents($icon)) {
					$icon_file = PLUGIN_DIR."cms/resources/public/images/cms/"."cms-generic-icon.png";
					$source = CACHE_DIR."cms-generic-icon.gif";
				}
				else $source = CACHE_DIR."cms-generic-icon-{$icon_type}.gif";
				file_put_contents($source, $icon_file);
			}
		}
    if(!is_file($file) || !is_readable($file)) {
      File::resize_image($source, $file, $size, $compression);
    }
		if($this->image = File::display_image($file) ) {
			return true;
		} return false;
	}
	
}