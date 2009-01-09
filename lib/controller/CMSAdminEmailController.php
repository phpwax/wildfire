<?php

class CMSAdminEmailController extends CMSAdminComponent {
	public $module_name = "email";											
	public $model_class = 'Client';
	public $model_name = "client";													
	public $display_name = "Email";
	
	public $scaffold_columns = array(
    "Subject"   =>array("link"=>"edit"),
    "SentDate" => array(),
		"TotalRecipients" => array()
  );
  public $filter_columns = false;
	public $allowed_images = false; //no images
	public $allowed_categories = flase; //no categories
	public $edit_author = false; 
	public $extra_content = array(); //extra content fields - runs off the cms_extra_content table
	public $extra_content_options = array(); //corresponding config for the fields
	public $default_order = 'published';
	public $default_direction = 'DESC';
	
	
	function __construct() {
		/**
		* authentication
		**/
		$auth = new WaxAuthDb(array("encrypt"=>false, "db_table"=>$this->auth_database_table, "session_key"=>"wildfire_user"));
		$this->current_user = $auth->get_user();
		if($this->current_user->usergroup==30) $this->is_admin=true;
		/**
		* module setup
		**/
		$this->before_filter("all", "check_authorised", array("login"));
		$this->configure_modules();
		$this->all_modules = CMSApplication::get_modules(true);
		if(!array_key_exists($this->module_name,CMSApplication::get_modules())){
			Session::add_message('This component is not registered with the application.');
			$this->redirect_to('/admin/home/index');
		}
		/**
		* model instanciation
		**/
		if($this->model_class) {				
			$conf = CmsConfiguration::get("general");
			$this->model = new $this->model_class($conf['campaign_monitor_ClientID']);
		  $this->model_name = WXInflections::underscore($this->model_class);
		  if (!$this->scaffold_columns && is_array($this->model->column_info())) {
        $this->scaffold_columns = array_keys($this->model->column_info());
      }
	  }
		$this->sub_links["create"] = "Create New ". $this->display_name;
		if(!$this->this_page = WaxUrl::get("page")) $this->this_page=1;
	}
	
	/**
	* magic method to catch all if the action thats requested doesn't exist
	* this function is used for the section filter drop down; which creates a url like /admin/content/section-url
	* and this converts that into a filtered view of the content by the section specified
	**/
	public function method_missing() {
	  if(!$page = $this->param("page")) $page=1;
		$this->all_rows = $this->model->all($page, 10);
		$this->filter_block_partial = $this->render_partial("filter_block");
		$this->list = $this->render_partial("list");
	}
	/**
	* main listing page - paginated
	**/
	public function index() {
	  if(!$page = $this->param("page")) $page=1;		
	  Session::set("list_refer", $_SERVER['REQUEST_URI']);	  
		$this->display_action_name = 'List Campaigns';
		$this->all_rows = $this->model->all();
		
		$this->filter_block_partial ="";
		$this->list = $this->render_partial("list");
	}
	/**
	* Ajax function - associates the image whose id is posted in with the content record
	* - image id via POST
	* - content id via url (/admin/content/add_image/id)
	**/
	public function add_image() {
		$this->use_layout=false;
		$this->page = new $this->model_class(Request::get('id'));
		$file = new WildfireFile(Request::post('id'));
		$this->page->images = $file;
		$this->image = $file;
	}
	/**
	* Ajax function - removes the association between the image & content whose details are passed in 
	* - image id via POST
	* - content id via url (/admin/content/remove_image/ID)
	**/
	public function remove_image() {
		$this->use_layout=false;
		$page = new $this->model_class(Request::get('id'));
		$image = new WildfireFile($this->param("image"));
		$page->images->unlink($image);
	}
	
	public function attached_images(){
		$this->use_layout = false;
		$this->page = $this->model = new $this->model_class(Request::get('id'));
		if(!$this->attached_images = $this->page->images) $this->attached_images=array();
		$this->image_model = new WildfireFile;
		//partials
		$this->image_partial = $this->render_partial("page_images");
	}
	
	/**
	* the editing function... lets you change all the bits associated with the content record
	* gets the record for the id passed (/admin/content/edit/ID)
	* finds associated images & categories
	* render the partials
	*/
	public function edit() {
		$this->page = new $this->model_class(WaxUrl::get("id"));
		//images
    if(!$this->attached_images = $this->page->images) $this->attached_images=array();
    
		//categories assocaited
		if(!$this->attached_categories = $this->page->categories) $this->attached_categories= array();
		$cat = new CmsCategory;
		//all categories
		if(!$this->all_categories = $cat->order("name ASC")->all() ) $this->all_categories=array();
		$this->image_model = new WildfireFile;
		//partials
		$this->image_partial = $this->render_partial("page_images");
		$this->cat_partial = $this->render_partial("list_categories");
		$this->cat_list = $this->render_partial("cat_list");
		$this->category_partial = $this->render_partial("apply_categories");
		$files = new WildfireFile();
		$this->all_links = $files->find_all_files();
		$this->link_partial = $this->render_partial("apply_links");
		//parent edit function - this handles the save etc
		parent::edit();
		$this->extra_content_partial = $this->render_partial("extra_content");
		$this->flash_files = $files->flash_files();
		$this->video_partial = $this->render_partial("apply_video");
		$this->form = $this->render_partial("form");
	}
	/**
	* create function - this now makes a temporary record in the database with a status of 3
	* make sure it has author and a temp url - to pass validation
	* reason this now redirects is so people can edit / add categories and images without have to save the content first
	**/
	public function create() {
		$model = new $this->model_class;
		$model->status = 3;
		$model->author_id = Session::get('wildfire_user');
		$model->url = time();
		$this->redirect_to("/admin/content/edit/".$model->save()->id."/");
	}
	/**
	* Ajax function - associates a category with a content record
	* creates a view with resulting info
	**/
	public function add_category() {
	  $this->use_layout=false;
		$this->page = new $this->model_class(WaxUrl::get("id"));
		$category = new CmsCategory(substr($_POST["id"], 4));
		$this->page->categories = $category;
		if(!$this->attached_categories = $this->page->categories) $this->attached_categories= array();
		$cat = new CmsCategory;
		if(!$this->all_categories = $cat->order("name ASC")->all() ) $this->all_categories=array();		
		$this->cat_partial = $this->render_partial("list_categories");
	}
	/**
	* Ajax function - removes an association between a category and a content record
	* makes a view with new data
	**/
	public function remove_category() {
		$this->use_layout=false;
		$this->page = new $this->model_class(WaxUrl::get("id"));
		$category = new CmsCategory(Request::get("cat"));
		$this->page->categories->unlink($category);
    if(!$this->attached_categories = $this->page->categories) $this->attached_categories= array();
		$cat = new CmsCategory;
		if(!$this->all_categories = $cat->order("name ASC")->all() ) $this->all_categories=array();		
		$this->cat_partial = $this->render_partial("list_categories");	
	}
	/**
	* Ajax function - makes a new category on the file and returns the new list in the view
	**/
	public function new_category() {
		$this->use_layout=false;
		$cat = new CmsCategory;
		$cat->name = Request::get("cat");
		$cat->save();
		if(!$this->all_categories = $cat->clear()->order("name ASC")->all()) $this->all_categories=array();		
		$this->cat_list = $this->render_partial("cat_list");	
	}
	/**
	* cool function that autosaves your current document via ajax call
	**/
	public function autosave() {
	  $this->use_layout=false;
	  $this->use_view=false;
	  $content = new $this->model_class($this->param("id"));
	  $content->update_attributes(array("content"=>$_POST["content"]));
	  echo date("H:i:s");
	  exit;
	}	
	
	public function status(){
		if($id = Request::get('id')){
			$content = new CmsContent($id);
			if(isset($_GET['status'])) $content->status = Request::get('status');
			$this->row = $content->save();
			if(Request::get('ajax')) $this->use_layout = false;
			else $this->redirect_to(Session::get('list_refer'));
		}else $this->redirect_to("/admin/home");
	}
	
	
	
}
?>
