<?php
/**
* Content Controller
* @package PHP-WAX CMS
*/
class CMSAdminContentController extends CMSAdminComponent {
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
	public $extra_content = array(); //extra content fields - runs off the cms_extra_content table
	public $extra_content_options = array(); //corresponding config for the fields
	public $default_order = 'published';
	public $default_direction = 'DESC';
	
	
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
		$this->all_rows = $this->model->filter(array('cms_section_id'=>$sect_id) )->order("published DESC")->page($page, 10);
		$this->filter_block_partial = $this->render_partial("filter_block");
		$this->list = $this->render_partial("list");
	}
	/**
	* main listing page - paginated
	**/
	public function index() {
	  if(!$page = $this->param("page")) $page=1;
		/** 
		*	remove temporary files 
		*	- now using the date_created field to make sure that only files older than an hour created by the logged in user will be deleted. 
		*	This is should avoid any accidental deletion of temp records that are still being worked on.
		**/
		$author_id = $this->current_user->id; 
		$time = date("Y-m-d H:i:s", mktime( date("H")-1, 0, 0, date("m"), date("d"), date("Y") ) );
		$temp_content = $this->model->filter(array('author_id'=>$author_id, 'status'=>3))->filter("`date_created` < '$time'")->all();
		if(count($temp_content)){
			foreach($temp_content as $content) $content->delete();
		}
		/**
		* work out the items to display - hide those temp files
		**/
		$this->display_action_name = 'List Items';
		$this->all_rows = $this->model->clear()->filter("`status` <> '3' ")->order("published DESC")->page($page, $this->list_limit);
		$this->filter_block_partial .= $this->render_partial("filter_block");
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
		if($existing = $this->page->images->filter(array("order_by" => Request::post('order'))) ) $this->page->images->unlink($existing);
		$join = $this->page->get_col("images")->set($file);
		$join->order_by = Request::post('order');
		$join->save();
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
	/**
	* the editing function... lets you change all the bits associated with the content record
	* gets the record for the id passed (/admin/content/edit/ID)
	* finds associated images & categories
	* render the partials
	*/
	public function edit() {
		$this->page = new $this->model_class(WaxUrl::get("id"));
		//images
		if(!$attached_images = $this->page->images) $attached_images=array();
		foreach($attached_images as $image){
		  $this->attached_images[$this->page->get_col("images")->join_model->filter(array("wildfire_file_id" => $image->primval))->first()->order_by] = $image;
		}
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
		$this->form = $this->render_partial("form");
	}
	/**
	* create function - this now makes a temporary record in the database with a status of 3
	* make sure it has author and a temp url - to pass validation
	* reason this now redirects is so people can edit / add categories and images without have to save the content first
	**/
	public function create() {
		$model = new CmsContent();
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
		if(!$this->all_categories = $cat->clear()->order("parent_id ASC, name ASC")->all()) $this->all_categories=array();		
		$this->cat_list = $this->render_partial("cat_list");	
	}
	/**
	* cool function that autosaves your current document via ajax call
	**/
	public function autosave() {
	  $this->use_layout=false;
	  $this->use_view=false;
	  $content = new CmsContent($this->param("id"));
	  $content->update_attributes(array("content"=>$_POST["content"]));
	  echo date("H:i:s");
	  exit;
	}	
	
	
	
	
	
}
?>
