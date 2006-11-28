<?php
/**
* Class giving an admin interface to manipulate files
* @package CMSPlugin
* @author WebXpress <ross@webxpress.com>
* @version 1.0
*/

class CMSAdminFileController extends CMSAdminComponent {
		
  public $model;
	public $model_class="CmsResource";
	public $db_table;
	public $ajax_file_browser=true;
	public $display_name = "Files and Images";
		
		
	function __construct( ) {
		parent::__construct();
    $this->db_table = underscore($this->model_class);
	}
	
	public function index() {
	  if(!$this->ajax_file_browser) return parent::index();
	  $this->redirect_to("browse");
	}
	
	public function browse() {
	  $this->file_to_edit = new $this->model_class;
	  $this->root_folder=$this->model->url_base;
	  $this->all_rows = $this->model->list_path($this->model->get_root_path(), array( 'order' => $this->get_list_order(), 'limit' => $this->get_list_limit(), 'offset' => $this->get_list_offset( ) ) );
		if(!$this->all_rows) $this->all_rows=array();
		$this->files_partial = $this->render_partial("show_files");
		$this->form = $this->render_partial("form");
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
	
	public function filter() {
	  $this->use_layout=false;
	  $this->all_rows = $this->model->list_path($this->model->get_root_path(), 
	    array( "conditions"=>"filename LIKE '%{$_POST['filter']}%'", 'order' => $this->get_list_order(), 'limit' => $this->get_list_limit(), 'offset' => $this->get_list_offset( ) ) );
		if(!$this->all_rows) $this->all_rows=array();
		$this->files_partial = $this->render_partial("show_files");
	}
	
	public function edit() {
		$this->accept_routes=1;
    $this->file_to_edit = new $this->model_class($this->route_array[0]);
		$this->existing_image = $this->file_to_edit->file_url();
		$this->form = $this->render_partial("form");
		$this->save($this->file_to_edit);
	}
	
	public function inline_edit() {
	  $this->accept_routes=1;
	  $this->use_layout=false;
    $this->file_to_edit = new $this->model_class($this->route_array[0]);
		$this->existing_image = $this->file_to_edit->file_url();
		$this->form = $this->render_partial("form");
		$this->save($this->file_to_edit);
	}
  
  public function create() {	  
    $this->file_to_edit = new $this->model_class;
		$this->form = $this->render_partial("form");
		$this->save($this->file_to_edit);
  }

	public function update() {
		$this->accept_routes=1;
		$id = $this->route_array[0];
    $file = new $this->model_class($id);
		$this->save($file);
  }

	public function delete(){
		$this->accept_routes=1;
		$record_to_delete = $this->route_array[0];
			if($this->model->delete($record_to_delete) ) {
				Session::add_message("File successfully deleted");
				$this->redirect_to('index');
			} else $this->model->add_error("", "Error deleting file");
	}
	
	protected function save($file) {
		if($file->is_posted()) {
			$new_values = $_POST[$this->db_table];
			if(isset($_FILES[$this->db_table])) $new_values['filename'] = $_FILES[$this->db_table];
      if($file->update_attributes($new_values) ) {
        Session::add_message("File Successfully Saved");
        $this->redirect_to('index');
      }
    }
	}
		

}
?>