<?php
/**
* Class giving an admin interface to manipulate files
* @package CMSPlugin
* @author WebXpress <ross@webxpress.com>
* @version 1.0
*/

class CMSAdminFileController extends CMSAdminComponent {
		
  public $model;
	public $model_class="CmsFile";
	public $display_name = "Files and Images";
	
	
	public function file_info() {
	  $this->use_layout=false;
	  $this->accept_routes=1;
	  $this->show_file = new $this->model_class($this->route_array[0]);
	  $this->file_size = floor( filesize($this->show_file->path.$this->show_file->filename) / 1024)." Kb";
	}
	
	public function show_image() {
  	$this->use_view=false;  	
  	if(!isset($this->route_array[1])) $size=110;
  	 else $size = $this->route_array[1];
  	$this->show_image = new CmsFile($this->route_array[0]);

    $source = $this->show_image->path.$this->show_image->filename;
    $file = CACHE_DIR.$this->route_array[0]."_".$this->route_array[1];
    if(!is_readable($file)) {
      File::resize_image($source, $file, $size);
    }
		if($this->image = File::display_image($file) ) {
			return true;
		}
    return false;
  }
	
	public function download_file() {
	  $this->use_layout=false;
	  $this->get_file = new $this->model_class($this->param("id"));
	  File::stream_file($this->get_file->path.$this->get_file->filename);
	}
		

}
?>