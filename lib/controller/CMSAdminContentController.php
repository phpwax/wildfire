<?php
/**
* Content Controller
* @package PHP-WAX CMS
*/
class CMSAdminContentController extends AdminComponent {
	public $module_name = "content";											
	public $model_class = 'CmsContent';
	public $model_name = "cms_content";													
	public $display_name = "Site Content";
	
	public $scaffold_columns = array(
    "title"   =>array("link"=>"edit"),
    "by" => array(),
		"section_name" => array("display"=>"Section"),
		"date_published" => array("display"=>"Published")
  );
  public $filter_columns = array("title");
	public $allowed_images = 3; //allows 3 images to be attached to a cms_content record
	public $allowed_categories = true; //allows the use of categories
	public $edit_author = false; 
	public $edit_meta = true; 
	public $extra_content = array(); //extra content fields - runs off the cms_extra_content table
	public $extra_content_options = array(); //corresponding config for the fields
	public $default_order = 'published';
	public $default_direction = 'DESC';
	public $created_on_col = "date_created";
	public $auth_col = "author_id";
	public $status_col = "status";
	public $modal_preview = false;
	public $languages = array(0=>"english");
	public static $permissions = array("create","edit","delete","categories","attach_images","inline_images","html","video","audio", "publish");
	
	public function controller_global(){
    if($ids = $this->current_user->allowed_sections_ids) $this->model->filter(array("cms_section_id"=>$ids));
	}
	
	/**
	* magic method to catch all if the action thats requested doesn't exist
	* this function is used for the section filter drop down; which creates a url like /admin/content/section-url
	* and this converts that into a filtered view of the content by the section specified
	**/
	public function method_missing() {
	  if(!$page = $this->param("page")) $page=1;
		$this->use_view="index";
		$section = new CmsSection;
		/**
		* find the section - if not default it to 1
		**/
		$section = $section->filter(array('url'=>$this->action))->first();
		if($section) $sect_id = $section->id;
		else $sect_id = 1;
		$this->all_rows = $this->model->filter(array('cms_section_id'=>$sect_id,"status"=>array(0,1)))->order($this->default_order." DESC")->page($page, 10);
	}
	/**
	* main listing page - paginated
	**/
	public function index() {
	  if(!$page = Request::param("page")) $page=1;
	  Session::set("list_refer-".$this->module_name, $_SERVER['REQUEST_URI']);
	  
		/** 
		*	remove temporary files 
		*	- now using the date_created field to make sure that only files older than an hour created by the logged in user will be deleted. 
		*	This is should avoid any accidental deletion of temp records that are still being worked on.
		**/
	  if($status_col){
  		$clear_tmp_model = clone $this->model;
  		$time = date("Y-m-d H:i:s", mktime( date("H")-1, 0, 0, date("m"), date("d"), date("Y") ) );
  		if($this->auth_col) $clear_tmp_model->filter(array("$this->auth_col"=>$this->current_user->id));
  		if($this->status_col) $clear_tmp_model->filter(array("$this->status_col"=>3));
  		$clear_tmp_model->filter("`".$this->created_on_col."` < '$time'");
			foreach($clear_tmp_model->all() as $tmp_content) $tmp_content->delete();
		}
		/**
		* work out the items to display - hide those temp files
		**/
		$this->display_action_name = 'List Items';
		$this->all_rows = $this->model->filter(array("status"=>array(0,1)))->order($this->default_order." ".$this->default_direction)->page($page, $this->list_limit);
	}
	/**
	* Ajax Filter list view
	*/
	public function filter() {
	  $this->model->filter(array("status"=>array(0,1)));
	  if(post("section")){
	    $section = new CmsSection(post("section"));
	    foreach($section->tree() as $section) $section_ids[] = $section->primval;
	    $this->model->filter(array("cms_section_id"=>$section_ids));
    }
	  parent::filter();
	  $this->use_view="_list";
	}
	/**
	* Ajax function - associates the image whose id is posted in with the content record
	* - image id via POST
	* - content id via url (/admin/content/add_image/id)
	**/
	public function add_image() {
	  $this->use_layout=false;
	  $this->model = new $this->model_class(get('id'));
	  if(Request::post("id")) $this->model->images = new WildfireFile(post('id'));
	  $this->use_view = "_content_images";
	}
	/**
	* Ajax function - removes the association between the image & content whose details are passed in 
	* - image id via POST
	* - content id via url (/admin/content/remove_image/ID)
	**/
	public function remove_image() {
		$this->model = new $this->model_class(get('id'));
		$this->model->images->unlink(new WildfireFile(post("image")));
		$this->use_layout=false;
		$this->use_view = "_content_images";
	}
	
	public function sort_images() {
	  $this->use_layout=false;
	  $this->model = new $this->model_class(get('id'));
	  parse_str(Request::post("sort"), $sort);
	  if($sort=$sort["cimage"]) {
	    $i=1;
	    foreach($sort as $index) {$order[$index]=$i;$i++;}
	    $mod = $this->model->get_col("images");
      foreach($mod->join_model->all() as $join) {
        $join->join_order = $order[$join->wildfire_file_id];
        $join->save();
      }
	  }
	  $this->use_view = "_content_images";
	}
	
	public function attached_images(){
		$this->use_layout = false;
		$this->model = new $this->model_class(get('id'));
		$this->use_view="_content_images";
	}
	
	/**
	 * publish function, passes on to save, but forces status to published or updates existing page
	 */
	protected function publish($model, $redirect_to=false) {
    if($model->status == 4){ //if we have a preview copy we should update the master and destroy the copy
      $master = $model->master;
      $_POST[$model->table]['status'] = $master->status;
      $_POST[$model->table]['preview_master_id'] = $master->master;
      $master = $model->copy($master); //copy so that associations work correctly
      $model->delete();
	    $this->save($master, $redirect_to, "Successfully Updated");
    }else{ //otherwise this is a first publish, and we should just save, forcing the status to be published
	    if($_POST[$model->table]['status'] == 5) $_POST[$model->table]['status'] = 6;
	    else $_POST[$model->table]['status'] = 1;
	    $this->save($model, $redirect_to, "Successfully Published");
    }
	}
	/**
	* the editing function... lets you change all the bits associated with the content record
	* gets the record for the id passed (/admin/content/edit/ID)
	*/
	public function edit() {
    if(!($this->model = new $this->model_class(Request::get("id")))) $this->redirect_to(Session::get("list_refer")); //extra safety check for existance of the initial id as it's passed in, go back to the list if you're trying to get to an id that doesn't exist

    $this->original = $this->model->get_original();
    
		if($lang_id = Request::get("lang")) $this->original = $this->original->get_language_copy($lang_id); //get language revision
    
    if($this->model->is_published()) $this->model = $this->original->get_preview_copy();
    
		if($this->model->is_posted()){
  		if($_POST['publish_x']) $this->publish($this->model, Session::get("list_refer-".$this->module_name));
  	  else{
  	    if($this->model->status == 3) $this->model->status = 0;
  	    $this->save($this->model, Session::get("list_refer-".$this->module_name));
	    }
    }

		//images
    if(count($this->model->images)) $this->attached_images=$this->model->images;
    elseif($this->model->master && $this->model->master->primval && $this->model->master->images && $this->model->master->images->count()) $this->attached_images=$this->model->master->images;
    else $this->attached_images = array();
    
		//categories assocaited
		if(!$this->attached_categories = $this->model->categories) $this->attached_categories= array();
		$cat = new CmsCategory;
		//all categories
		if(!$this->all_categories = $cat->order("name ASC")->all() ) $this->all_categories=array();
		$this->image_model = new WildfireFile;
	}
	/**
	 * delete function - cleans up any preview content for the deleted content
	 *
	 * @return void
	 * @author Sheldon
	 */
	public function delete(){
	  $this->model->clear()->filter(array('preview_master_id' => WaxUrl::get("id")))->delete();
	  parent::delete();
	}
	/**
	* create function - this now makes a temporary record in the database with a status of 3
	* make sure it has author and a temp url - to pass validation
	* reason this now redirects is so people can edit / add categories and images without have to save the content first
	**/
	public function create() {
		$model = new $this->model_class;
		$new = $model->update_attributes(array("status"=>3, "author_id"=>Session::get('wildfire_user_cookie'),"url" => time(),"title"=>"Enter Your Title Here"));
		$this->redirect_to("/admin/content/edit/".$new->id."/");
	}

	
	/**
	* Ajax function - associates a category with a content record
	* creates a view with resulting info
	**/
	public function add_category() {
	  $this->use_layout=false;
		$this->model = new $this->model_class(get("id"));
		$this->model->categories = new CmsCategory(substr(post("id"), 4));
		$cat = new CmsCategory;
		if(!$this->all_categories = $cat->all() ) $this->all_categories=array();		
		$this->use_view = "_list_categories";	
	}
	/**
	* Ajax function - removes an association between a category and a content record
	* makes a view with new data
	**/
	public function remove_category() {
		$this->use_layout=false;
		$this->model = new $this->model_class(get("id"));
		$this->model->categories->unlink(new CmsCategory(get("cat")));
		$cat = new CmsCategory;
		if(!$this->all_categories = $cat->all() ) $this->all_categories=array();		
		$this->use_view = "_list_categories";	
	}
	/**
	* Ajax function - makes a new category on the file and returns the new list in the view
	**/
	public function new_category() {
		$this->use_layout=false;
		$cat = new CmsCategory;
		$cat->name = Request::get("cat");
		$cat->save();
		if(!$this->all_categories = $cat->clear()->all()) $this->all_categories=array();	
		$this->use_view = "_cat_list";	
	}
	/**
	* cool function that autosaves your current document via ajax call
	**/
	public function autosave() {
	  $content = new $this->model_class(get("id"));
	  if($content->primval) {
	    $content->update_attributes(post("cms_content"));
	    echo date("H:i:s");
	  }
	  exit;
	}	
	
	public function status(){
		if($id = Request::get('id')){
			$content = new CmsContent($id);
			if(isset($_GET['status'])) $content->status = get('status');
			$this->row = $content->save();
			if(get('ajax')) $this->use_layout = false;
			else $this->redirect_to(Session::get('list_refer'));
		}else $this->redirect_to("/admin/home");
	}
	
	public function search() {
	  $this->content_results = array();
	  $this->model->filter(array("status"=>array(0,1)));
	  $this->use_layout=false;
	  if($input = Request::post("input")) {
	    $this->content_results = $this->model->filter("title LIKE '%$input%'")->order("published DESC")->limit(8)->all();
	  }
	}
	
	
}
?>
