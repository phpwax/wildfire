<?php
/**
* Class giving an admin interface to manipulate files
* @package PHP-WAX CMS
*/

class CMSAdminFileController extends AdminComponent {
	public $module_name = "files";												
  public $model;
	public $model_class="WildfireFile";
	public $display_name = "Files";
	public $scaffold_columns = array(
    "filename"   =>array(),
    "type" => array()
  );
	public $filter_columns = array("filename", "caption");
	public $order_by_columns = array("filename","type");
	public $allow_crops=false;
	public $sub_links = array("synchronise"=>"File Synchronise");
	public $permissions = array("create","edit","delete");
	
	public static $max_image_width = false;

	/**
	* this is used to call the parent and then reset the sub menu - as its not used for this controller
	**/
	public function controller_global(){
		parent::controller_global();
		unset($this->sub_links["index"]);
		unset($this->sub_links["create"]);

	}
	
	public function fs() {
	  $this->use_layout=false;
	  $this->use_view=false;
	  if(!$action = $_POST["relay"]) $action = $_GET["relay"];
	  $fs = new CmsFilesystem;
	  $fs->dispatch($action, array_merge($_GET, $_POST));
	}
	
	public function synchronise() {
	  set_time_limit(0);
	  if($_POST && $_POST['sync']=="go") {
	    $fs = new CmsFilesystem;
	    $scan = File::get_folders($fs->defaultFileStore.$fs->relativepath);
			if(is_array($scan) ){
	    	foreach($scan as $folder) {
	      	$rel = str_replace($fs->defaultFileStore, "", $folder['path']);
	      	$fs->databaseSync($folder['path'], $rel);
	    	}
			}
			Session::add_message('Files have been synchronised!');
			$this->redirect_to("/admin/files/");
	  }
	}
	
	public function index() {
	  parent::index();
	  $this->use_layout="file";
	}
	
	public function upload_url() {
	  $this->use_layout="simple";
		if($class = Request::get('model')){
			if($id = Request::param("id")) $this->page = new $class($id);
		}
	}
	
	/** AJAX IMAGE EDITING **/
	public function rotate(){
		$this->use_layout=false;
		if(Request::get('id') && Request::get('angle')){
			$this->model = new WildfireFile(Request::get('id'));
			$location = PUBLIC_DIR. $this->model->url();
			File::rotate_image($location, $location, Request::get('angle') );	
			$this->clear_image_cache($id);
		}else exit;
	}
	/** AJAX IMAGE EDITING **/	
	public function crop(){
		$this->use_layout=false;
		if($id = Request::get('id') ){
			$this->model = new $this->model_class($id);
			if($data = Request::post('crop')){
				$location = PUBLIC_DIR. $this->model->url();		
				File::crop_image($location, $location, $data['x1'], $data['y1'], $data['w'], $data['h']);
				$this->clear_image_cache($id);
			}
		}else exit;
	}
	
	public function clear_image_cache($id) {
    $look_for = CACHE_DIR."images/". $image_id."_*";
		foreach(glob($look_for) as $filename){
			@unlink($filename);
		}
  }
	/** AJAX IMAGE EDITING **/	
	public function resize(){
		$this->use_layout=false;
		if($id = Request::get('id') ){
			$this->model = new $this->model_class($id);
			if($data = $_REQUEST['percent']){
				$location = PUBLIC_DIR. $this->model->url();
				File::resize_image_extra($location, $location, $data);
				$this->clear_image_cache($id);
			}
		}else exit;
	}
	
	/**
	 * admin area version of show image - outputs an image
	 */	
	public function show_image() {
	  $options = Request::get("params");
	  $img_id = Request::get("id");
	  $img_size = $options[0];
  	$this->use_view=false;
		$this->use_layout=false;
  	if(!$size = $img_size) $size=110;
  	else{
			if(strrpos($size, ".")>0) $size = substr($size, 0, strrpos($size, "."));
		}
  	$img = new WildfireFile($img_id);
    $img->show($size);
  }
	
	public function download_file() {
	  $this->use_layout=false;
	  $this->get_file = new $this->model_class(Request::get("id"));
	  File::stream_file($this->get_file->path.$this->get_file->filename);
	}
	
	public function create() {
		$this->model = new $this->model_class;
		/* CHANGED - REMOVE PUBLIC AS THATS THE NEW BASE DIR */
		$this->model->file_base = "public/".$_POST['cms_file']['folder']."/";	
		$this->save($this->model);
	}
	
	
	public function edit() {
		if($id = Request::get('id') ){
  	  $this->sub_links = array("copy"=>"Work on a copy");
			$this->model = new $this->model_class($id);
			
		}else exit;
	}
	
	public function copy() {
	  if($id = Request::get('id') ){
			$this->model = new $this->model_class($id);
			$copy_file = File::safe_file_save(PUBLIC_DIR.$this->model->rpath."/", $this->model->filename);
			$full_copy_file = PUBLIC_DIR.$this->model->rpath."/".$copy_file;
			$file = PUBLIC_DIR.$this->model->rpath."/".$this->model->filename;
			copy($file, $full_copy_file);
      $fs = new CmsFilesystem;
      $fs->databaseSync(PUBLIC_DIR.$this->model->rpath, $this->model->rpath);
      $copy = new $this->model_class();
      $copy = $copy->filter(array("rpath"=>$this->model->rpath, "filename"=>$copy_file))->first();
      $this->redirect_to("/admin/files/edit/".$copy->id);
		}
	}
	
	public function upload() {
   $this->use_layout=false;
	}
	public function quickupload() {
		if($class = Request::get('model')){
			if($id = Request::param("id")) $this->page = new $class($id);
		}
    $this->use_layout="simple";
    $this->use_view="upload";
	}
	
	
	public function browse_images() {
	  $this->image_model = new WildfireFile;
		
		$this->browse_filesystem();
	}
	
	public function browse_filesystem(){
	  $mime_type = $_REQUEST['mime_type'];
	  $this->use_layout=false;
	  $model = new WildfireFile("available");
	  $model->order("filename ASC");
	  $fs = new CmsFilesystem;
	  $default_folder = $fs->relativePath;
		if(!$default_folder) $default_folder ="files";
		if($mime_type != "all") $model->filter("type","%".Request::param('mime_type')."%", "LIKE");	  
		if($filter = Request::param('filter')){
      $filter = mysql_escape_string($filter);
      $model->filter("(id LIKE '%$filter%' OR filename LIKE '%$filter%' OR description LIKE '%$filter%')");
    }
    if($folder=Request::post('filterfolder')) $this->all_images = $model->filter("rpath", $folder)->all();
  	else if(!Request::param('filter')) $this->all_images = $model->filter("rpath", $default_folder)->all();
  	else $this->all_images = $model->all();
	}
	
	public function image_filter() {
	  $this->browse_filesystem();
	  $this->use_view = "image_filter";
  }
  
  public function preview() {
    $this->image = new $this->model_class(url('id'));
  }
  
  public function inline_image_edit() {
    $this->use_layout=false;
  }
  
  public function image_urls() {
    $this->use_layout=false;
    $this->image = new WildfireFile(Request::get("id"));
  }
  
  public function inline_browse() {
    $this->browse_images();
  }

	/**
	* Special conversion function - takes the details in the old cms switches it over the the new cms
	**/
  public function port_ids() {
    $file = new CmsFile;
    $files = $file->find_all();
    foreach($files as $file) {
      $new = new WildfireFile;
      $s_path = rtrim(str_replace("public/","",strrchr($file->path,"public/files")), "/" );
      $new_file = $new->filter("filename = '{$file->filename}' AND rpath LIKE '%{$s_path}%'" )->first();
      if($new_file->id)  {
        $new_file->oldid = $file->id;
        $new_file->description = $file->caption;
        $new_file->save();
      }
    }
    exit;
  }
	/**
	* Special conversion function - takes the details in the old cms switches it over the the new cms
	**/
  public function port_content() {
    $content = new CmsContent;
    $articles = $content->find_all(array("order"=>"id ASC"));
    $new = new WildfireFile;
    foreach($articles as $article) {
      $oldimgs = $new->sql("SELECT * FROM cms_content_cms_file WHERE cms_content_id = $article->id")->all();
   	  foreach($oldimgs as $img) {
   	    $newimg = $new->clear()->filter("oldid=".$img->cms_file_id)->first();
   	    $newfile = new WildfireFile($newimg->id);
   	    if($newfile->id) $article->images = $newfile;
   	  }
    }

  }

	/**
	* Save
	* @param string $model 
	* @return boolean or redirect on success, sets message on success
	*/
	protected function save($model, $redirect_to=false, $success = "Successfully Saved") {
		if( $model->is_posted() ) {
		  $id = $model->id;
			if(!$model->author_id && !$_POST[$this->model_name]['author_id']) $model->author_id = $this->current_user->id;			
			if($model->update_attributes($_POST[$this->model_name]) ) {
				//clear cache - rely on filename format of $id_
				foreach(File::scandir(CACHE_DIR) as $file){
					if(($pos = strpos($file, $model->id.'_')) == 0 && $pos !== false) unlink(CACHE_DIR.$file);
				}
			  if($redirect_to =="edit") $redirect_to = "edit/".$id;
			  elseif($this->allow_crops) $redirect_to="crop/".$id;
			  elseif(!$redirect_to) $redirect_to="index";
      	Session::add_message($this->display_name." ".$success);
      	$this->redirect_to($redirect_to);
			}
    }
 		return false;
	}
	

}
?>