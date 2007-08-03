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
	public $order_by_columns = array("filename","type");
	
	public function file_info() {
	  $this->use_layout=false;
	  $this->accept_routes=1;
	  $this->show_file = new $this->model_class($this->route_array[0]);
	  $this->file_size = floor( filesize($this->show_file->path.$this->show_file->filename) / 1024)." Kb";
	}
	
	public function index() {
	  parent::index();
	  $this->file_tree = $this->file_tree(PUBLIC_DIR."files/", "test");
	}
	
	public function show_image() {
  	$this->use_view=false;
		$this->use_layout=false;
		
  	if(!isset($this->route_array[1])) $size=110;
	   else $size = $this->route_array[1];
	  $size = str_replace(".jpg", "", $size);
	  $size = str_replace(".gif", "", $size);
	  $size = str_replace(".png", "", $size);
	  
  	$this->show_image = new CmsFile($this->route_array[0]);
    $source = $this->show_image->path.$this->show_image->filename;
		$file = CACHE_DIR.$this->route_array[0]."_".$this->route_array[1];
		if(!File::is_image($source)){
			if(!is_file($file) || !is_readable($file)) {
				$icon_type = File::get_extension($this->show_image->filename);
				$icon = cms_serve_asset('images','cms',"cms-generic-icon-{$icon_type}.gif");
				if(!$icon_file = file_get_contents($icon)) {
					$icon_file = cms_serve_asset('images','cms',"cms-generic-icon.png");
					$source = CACHE_DIR."cms-generic-icon.gif";
				}
				else $source = CACHE_DIR."cms-generic-icon-{$icon_type}.gif";
				file_put_contents($source, $icon_file);
			}
		}
    if(!is_file($file) || !is_readable($file)) {
      File::resize_image($source, $file, $size);
    }
		if($this->image = File::display_image($file) ) {
			return true;
		} return false;
  }
	
	public function download_file() {
	  $this->use_layout=false;
	  $this->get_file = new $this->model_class($this->param("id"));
	  File::stream_file($this->get_file->path.$this->get_file->filename);
	}
	
	public function create() {
		$this->model = new $this->model_class;
		$this->model->file_base = "public/".$_POST['cms_file']['folder'];	
		$this->save($this->model);
	}
	
	public function fetch_folder() {
	  $this->use_layout=false;
	  $folder = $_POST["folder"];
	  if(strpos($folder,"_")) $folder = str_replace("_", "/", $folder);
	  $folder = PUBLIC_DIR.$folder."/";
	  $this->all_rows = $this->model->find_all_by_path($folder);
	  $this->list = $this->render_partial("list");
	}
	
	public function browse_images() {
	  $this->more = false;
	  $this->previous = false;
	  if(!$this->param("id")) { 
	    $offset = 0;
	    $count = -1;
    } else {
      $offset = ($this->param("id") -1) * 12; 
      $count = 12;
    }
    $this->id = $this->param("id");
		$this->use_layout=false;
  	$this->all_images = ($image = new CmsFile) ? $image->find_all_images() : array();
  	if($count > 0 && count($this->all_images) > $offset + $count) $this->more = $this->id+1;
  	if($count > 0 && $offset > 0) $this->previous = $this->id -1;
  	if(count($this->all_images)) $this->all_images = new LimitIterator(new ArrayIterator($this->all_images), $offset, $count);
    $this->all_images_partial = $this->render_partial("list_all_images");  
	}
	
	public function image_filter() {
	  if(strlen($_POST['filter'])<1) {
	    $this->route_array[0] = "1";
	    $this->browse_images();
	  } else {
      $this->use_layout=false;
      $images = new CmsFile;
      $this->all_images = ($image = new CmsFile) ? $image->find_filter_images($_POST['filter']): array();
      $this->all_images_partial = $this->render_partial("list_all_images");
    }
  }
  
  public function preview() {
    $this->image = new $this->model_class($this->param('id'));
  }
  
  public function file_tree($directory, $return_link, $extensions = array()) {
  	// Generates a valid XHTML list of all directories, sub-directories, and files in $directory
  	// Remove trailing slash
  	if( substr($directory, -1) == "/" ) $directory = substr($directory, 0, strlen($directory) - 1);
  	$code = "<ul id='php-file-tree'><li class='pft-directory'>";
  	$code .= "<a href='#' id='".$this->unslashify($directory)."' class='tree_folder'>Your Folder</a>";
  	$code .= $this->file_tree_dir($directory, $return_link, $extensions);
  	$code .= "</li></ul>";
  	return $code;
  }

  public function file_tree_dir($directory, $return_link, $extensions = array(), $first_call = true) {

  	// Get and sort directories/files
  	$file = scandir($directory);
  	natcasesort($file);
  	// Make directories first
  	$files = $dirs = array();
  	foreach($file as $this_file) {
  		if( is_dir("$directory/$this_file" ) ) $dirs[] = $this_file; else $files[] = $this_file;
  	}
  	$file = array_merge($dirs, $files);

  	// Filter unwanted extensions
  	if( !empty($extensions) ) {
  		foreach( array_keys($file) as $key ) {
  			if( !is_dir("$directory/$file[$key]") ) {
  				$ext = substr($file[$key], strrpos($file[$key], ".") + 1); 
  				if( !in_array($ext, $extensions) ) unset($file[$key]);
  			}
  		}
  	}

  	if( count($file) > 2 ) { // Use 2 instead of 0 to account for . and .. "directories"
  		$php_file_tree = "<ul>";
  		foreach( $file as $this_file ) {
  			if( $this_file != "." && $this_file != ".." ) {
  				if( is_dir("$directory/$this_file") ) {
  					// Directory
  					$php_file_tree .= "<li class=\"pft-directory\"><a href=\"#\" id='".$this->unslashify($directory."/".$this_file)."' class='tree_folder'>" . htmlspecialchars($this_file) . "</a>";
  					$php_file_tree .= $this->file_tree_dir("$directory/$this_file", $return_link ,$extensions, false);
  					$php_file_tree .= "</li>";
  				} 
  			}
  		}
  		$php_file_tree .= "</ul>";
  	}
  	return $php_file_tree;
  }

	/**
	* Save
	* @param string $model 
	* @return boolean or redirect on success, sets message on success
	*/
	protected function save($model, $redirect_to=false, $success = "Successfully Saved") {
		if( $model->is_posted() ) {
			if(!$model->author_id && !$_POST[$this->model_name]['author_id']) $model->author_id = $this->current_user->id;			
			if($id = $model->update_attributes($_POST[$this->model_name]) ) {
				//clear cache - rely on filename format of $id_
				foreach(File::scandir(CACHE_DIR) as $file){
					if(($pos = strpos($file, $model->id.'_')) == 0 && $pos !== false) unlink(CACHE_DIR.$file);
				}
			  if($redirect_to =="edit") $redirect_to = "edit/".$id;
			  elseif(!$redirect_to) $redirect_to="index";
      	Session::add_message($this->display_name." ".$success);
      	$this->redirect_to($redirect_to);
			}
    }
 		return false;
	}
	
	protected function unslashify($path) {
	  $path = str_replace(PUBLIC_DIR, "", $path);
    return str_replace('/', '_', $path);
	}

}
?>