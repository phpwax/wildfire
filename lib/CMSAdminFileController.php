<?php
/**
* Class giving an admin interface to manipulate files
* @package PHP-WAX CMS
*/

class CMSAdminFileController extends CMSAdminComponent {
	public $module_name = "files";												
  public $model;
	public $model_class="CmsFile";
	public $display_name = "Files";
	public $scaffold_columns = array(
    "filename"   =>array(),
    "type" => array()
  );
	public $filter_columns = array("filename", "caption");
	
	public function file_info() {
	  $this->use_layout=false;
	  $this->accept_routes=1;
	  $this->show_file = new $this->model_class($this->route_array[0]);
	  $this->file_size = floor( filesize($this->show_file->path.$this->show_file->filename) / 1024)." Kb";
	}
	
	public function show_image() {
  	$this->use_view=false;
		$this->use_layout=false;
  	if(!isset($this->route_array[1])) $size=110;
  	 else $size = $this->route_array[1];
  	$this->show_image = new CmsFile($this->route_array[0]);

    $source = $this->show_image->path.$this->show_image->filename;
    $file = CACHE_DIR.$this->route_array[0]."_".$this->route_array[1];
    if(!is_file($file) || !is_readable($file)) {
      File::resize_image($source, $file, $size);
    }
		if($this->image = File::display_image($file) ) {
			return true;
		} else $this->image = File::display_image(PUBLIC_DIR."images/cms/cms-generic-icon.gif");
  }
	
	public function download_file() {
	  $this->use_layout=false;
	  $this->get_file = new $this->model_class($this->param("id"));
	  File::stream_file($this->get_file->path.$this->get_file->filename);
	}
	
	public function browse_images() {
		$this->use_layout=false;
  	$this->all_images = ($image = new CmsFile) ? $image->find_all_images() : array();
    $this->all_images_partial = $this->render_partial("list_all_images");  
	}
	
	public function image_filter() {
    $this->use_layout=false;
    $images = new CmsFile;
    $this->all_images = ($image = new CmsFile) ? $image->find_filter_images($_POST['filter']): array();
    $this->all_images_partial = $this->render_partial("list_all_images");  
  }
  
  public function preview() {
    $this->image = new $this->model_class($this->param('id'));
  }

}
?>