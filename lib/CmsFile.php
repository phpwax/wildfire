<?php

class CmsFile extends WXFileActiveRecord {
  
  public $base_dir = "files";
  
  public function find_all_images($params=array()) {
    if($params["conditions"]) $params["conditions"].=" AND type LIKE '%image%'";
    else $params["conditions"] = "type LIKE '%image%'";
	  return $this->find_all($params);
	}
	
	public function find_filter_images($filter, $limit = false) {
    $params = array("conditions"=>"type LIKE '%image%' AND (filename LIKE '%$filter%' OR caption LIKE '%$filter%')");
    if($limit) $params['limit']=$limit;
	  return $this->find_all($params);
	}
	
	public function extension() {
	  return ".gif";
	  $ext = ".".substr(strrchr($this->type, "/"), 1);
	  if($ext != ".gif" || $ext !=".png") $ext = ".jpg";
	  return $ext;
	}
	
	public function find_all_files() {
	  return $this->find_all(array("conditions"=>"type NOT LIKE '%image%'"));
	}
	
	public function file_size() {
	  $size = floor( filesize($this->file_path.$this->filename) / 1024);
	  if($size < 1024) return $size." Kb";
	  return ($size / 1024)." Mb"; 
	}
	
	public function folder_options() {
	  $options = content_tag("option", "Your Folder", array("value"=>$this->base_dir));
	  foreach($this->get_folders(PUBLIC_DIR.$this->base_dir) as $folder) {
	    $path = str_replace(PUBLIC_DIR, "", $folder["path"]);
	    $options .= content_tag("option", "&nbsp;&nbsp;".$folder["name"], array("value"=>$path));
	  }
	  return $options;
	}
	
	public function get_folders($directory) {
	  $rows=array();
		$iter = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($directory), true);
		foreach ( $iter as $file ) {
			if($iter->hasChildren() && !strstr($iter->getPath()."/".$file, "/.")) {
				$row['name']=str_repeat('&nbsp;&nbsp;', $iter->getDepth()).ucfirst(basename($file));
				$row['path']=$iter->getPath()."/".basename($file);
				$rows[]=$row; unset($row);
			} 
		}
		return $rows;
	}
	
	public function file_path() {
	  $original = $this->path;
	  $relative = strstr($original, "public/");
    $relative = str_replace("public/", "", $relative);
    $original = PUBLIC_DIR.$relative;
    return $original;
	}
	
	public function file_url() {
    $original = $this->file_path;
	  $url = str_replace(PUBLIC_DIR, "", $original). $this->filename;
	  return $url;
	}
	
	
}

?>