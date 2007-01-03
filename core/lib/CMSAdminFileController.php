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
	public $db_table;
	public $display_name = "Files and Images";
	public $tag_model = "CmsTag";
	
	public function create() {
		if($this->tag_model) {
	    $tag_model = new $this->tag_model;
  	  $this->tags = $tag_model->find_all();
	  }
		parent::create();
	}
	
	public function edit() {
	  if($this->tag_model) {
	    $tag_model = new $this->tag_model;
  	  $this->tags = $tag_model->find_all();
	  }
		parent::edit();
	}
	
	public function file_info() {
	  $this->use_layout=false;
	  $this->accept_routes=1;
	  $this->show_file = new $this->model_class($this->route_array[0]);
	  $this->file_size = floor( filesize($this->show_file->path.$this->show_file->filename) / 1024)." Kb";
	}
	
	public function show_image() {
	  $this->use_layout=false;
	  $this->accept_routes=2;
	  if(!isset($this->route_array[1])) $size=170;
	   else $size = $this->route_array[1];
	  $this->show_image = new $this->model_class($this->route_array[0]);
	  if($this->image = File::render_temp_image($this->show_image->path.$this->show_image->filename, $size) ) {
	    return true;
	  } else {
	    $this->image = File::display_image(PUBLIC_DIR."images/filesystem/generic.png");
	  }
	}
	
	public function download_file() {
	  $this->use_layout=false;
	  $this->accept_routes=1;
	  $this->get_file = new $this->model_class($this->route_array[0]);
	  File::stream_file($this->get_file->path.$this->get_file->filename);
	}
		

}
?>