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
	public $extra_content = array(); //extra content fields - runs off the cms_extra_content table
	public $extra_content_options = array(); //corresponding config for the fields
	public $default_order = 'published';
	public $default_direction = 'DESC';
	public $created_on_col = "date_created";
	public $auth_col = "author_id";
	public $status_col = "status";
	
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
		$this->filter_block_partial = $this->render_partial("filter_block");
		$this->list = $this->render_partial("list");
	}
	/**
	* main listing page - paginated
	**/
	public function index() {
	  if(!$page = $this->param("page")) $page=1;
	  Session::set("list_refer", $_SERVER['REQUEST_URI']);
	  
		/** 
		*	remove temporary files 
		*	- now using the date_created field to make sure that only files older than an hour created by the logged in user will be deleted. 
		*	This is should avoid any accidental deletion of temp records that are still being worked on.
		**/
		$author_id = $this->current_user->id; 
		$time = date("Y-m-d H:i:s", mktime( date("H")-1, 0, 0, date("m"), date("d"), date("Y") ) );
		if($auth_col = $this->auth_col) $this->model->filter(array("$auth_col"=>$author_id));
		if($status_col = $this->status_col) $this->model->filter(array("$status_col"=>3));
		$temp_content = $this->model->filter("`".$this->created_on_col."` < '$time'")->all();
		
		if(count($temp_content) && $status_col){
			foreach($temp_content as $content) $content->delete();
		}
		/**
		* work out the items to display - hide those temp files
		**/
		$this->display_action_name = 'List Items';
		$this->all_rows = $this->model->clear()->filter(array("status"=>array(0,1)))->order($this->default_order." ".$this->default_direction)->page($page, $this->list_limit);
		$this->filter_block_partial .= $this->render_partial("filter_block");
		$this->list = $this->render_partial("list");
	}
	/**
	* Ajax Filter list view
	*/
	public function filter() {
	  $this->model->filter(array("status"=>array(0,1)));
	  parent::filter();
	}
	/**
	* Ajax function - associates the image whose id is posted in with the content record
	* - image id via POST
	* - content id via url (/admin/content/add_image/id)
	**/
	public function add_image() {
	  $this->use_layout=false;
	  $this->page = new $this->model_class(Request::get('id'));
	  if(Request::post("id")) {
		  $file = new WildfireFile(Request::post('id'));
		  $this->page->images = $file;
		  $this->image = $file;
	  }
	}
	/**
	* Ajax function - removes the association between the image & content whose details are passed in 
	* - image id via POST
	* - content id via url (/admin/content/remove_image/ID)
	**/
	public function remove_image() {
		$this->use_layout=false;
		$this->page = new $this->model_class(Request::get('id'));
		$image = new WildfireFile($this->param("image"));
		$this->page->images->unlink($image);
	}
	
	public function attached_images(){
		$this->use_layout = false;
		$this->model = new $this->model_class(Request::get('id'));
		if(!$this->attached_images = $this->model->images) $this->attached_images=array();
		$this->image_model = new WildfireFile;
		//partials
	}
	
	/**
	* the editing function... lets you change all the bits associated with the content record
	* gets the record for the id passed (/admin/content/edit/ID)
	* finds associated images & categories
	* render the partials
	*/
	public function edit() {
	  $this->id = WaxUrl::get("id");
		if(!$this->id) $this->id = $this->route_array[0];
		
    $master = new $this->model_class($this->id);
    if($master->status == 4) $this->redirect_to("/admin/content/edit/$master->preview_master_id"); //this isn't a master, jump to the right url
	  $preview = new $this->model_class;
	  
	  //preview revision - create a copy of the content if needed or use the existing copy
		if($master->status == 1){
		  if(!($preview = $preview->filter(array("preview_master_id" => WaxUrl::get("id"), "status" => 4))->first())){
		    //if a preview entry doesn't exist create one
  		  foreach($master->columns as $col => $params)
  		    if($master->$col) $copy_attributes[$col] = $master->$col;
  		  $copy_attributes = array_diff_key($copy_attributes,array($this->model->primary_key => false)); //take out ID

    	  $preview = new $this->model_class;
    	  $preview->save();
  		  $preview->set_attributes($copy_attributes);
  		  $preview->status = 4;
  		  $preview->url = $master->url;
  		  $preview->master = $master->primval;
  		  $preview->save();
	    }
      $this->model = $preview;
      $this->model->status = 1; //set status to published, it's still 4 in the database, but will be saved as 1 overwriting the current master
		}else{
		  $this->model = $master;
		}
		
		if($this->model->is_posted()){
  		if($_POST['publish']){
  		  if($master->status != 1){
  		    $master->set_attributes($_POST[$this->model_name]);
  		    $master->status = 1;
  		    $master->save();
  		    $this->redirect_to("/admin/content/edit/".$master->id."/");
	      }else{
  		    $preview->set_attributes($_POST[$this->model_name]);
  		    $preview->status = 4;
  		    $preview->save();
          $preview->status = 1; //set status to published, it's still 4 in the database, but will be saved as 1 overwriting the current master
    		  foreach($preview->columns as $col => $params)
    		    if($preview->$col) $copy_attributes[$col] = $preview->$col;
    		  $copy_attributes = array_diff_key($copy_attributes,array_flip(array($preview->primary_key,"status","master"))); //take out ID and status
    		  $master->update_attributes($copy_attributes);
	      }
  		}elseif($_POST['close']){
		    //delete the preview if it has no changes from the master
		    if($preview->equals($master)) $preview->delete();
  		  $this->redirect_to(Session::get("list_refer"));
  	  }else{ //save button is default post, as it's the least destructive thing to do
  	    if($this->model === $preview) $_POST[$this->model_name]['status'] = 4;
    	  $this->save($this->model, "/admin/content/edit/".$master->id."/"); //preview version save for published or draft save for unpublished
  	  }
    }

		//images
    if(!$this->attached_images = $this->model->images) $this->attached_images=array();
    
		//categories assocaited
		if(!$this->attached_categories = $this->model->categories) $this->attached_categories= array();
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
		$this->extra_content_partial = $this->render_partial("extra_content");
		$this->flash_files = $files->flash_files();
		$this->video_partial = $this->render_partial("apply_video");
		$this->video_partial = $this->render_partial("wysi_tables");
		$this->form = $this->render_partial("form");
		
	}
	/**
	 * delete function - cleans up any preview content for the deleted content
	 *
	 * @return void
	 * @author Sheldon
	 */
	public function delete(){
	  parent::delete();
	  $this->model->clear()->filter(array('preview_master_id' => WaxUrl::get("id")))->delete();
	}
	/**
	* create function - this now makes a temporary record in the database with a status of 3
	* make sure it has author and a temp url - to pass validation
	* reason this now redirects is so people can edit / add categories and images without have to save the content first
	**/
	public function create() {
		$model = new $this->model_class;
		$model->status = 3;
		$model->author_id = Session::get('wildfire_user_cookie');
		$model->url = time();
		if(Request::get("title")) $model->title = Request::get("title");
		else $model->title = "Enter Your Title Here";
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
	
	public function search() {
	  $this->use_layout=false;
	  if($input = Request::post("input")) {
	    $content = new CmsContent;
	    $this->content_results = $content->search($input, array("title"=>"1.3", "content"=>"0.6"))->limit(5)->all();
	  }
	}
	
	
}
?>
