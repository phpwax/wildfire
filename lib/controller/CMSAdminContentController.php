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
	public $modal_preview = false;
	public $languages = array(0=>"english");
	public $permissions = array("create","edit","delete","categories","attach_images","inline_images","html","video","audio", "publish");
	
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
		$this->filter_block_partial .= $this->render_partial("filter_block");
		$this->list = $this->render_partial("list");
	}
	/**
	* Ajax Filter list view
	*/
	public function filter() {
	  $this->model->filter(array("status"=>array(0,1)));
	  if(Request::post("section")){
	    $section = new CmsSection(Request::post("section"));
	    foreach($section->tree() as $section) $section_ids[] = $section->primval;
	    $this->model->filter(array("cms_section_id"=>$section_ids));
    }
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
		$this->join_name = "images";
	  if(Request::post("id")) {
		  $this->image = new WildfireFile(Request::post('id'));
		  $this->image->join_order = Request::post('order');
		  $this->page->images = $this->image;
	  }
	}
	/**
	* Ajax function - removes the association between the image & content whose details are passed in 
	* - image id via POST
	* - content id via url (/admin/content/remove_image/ID)
	**/
	public function remove_image() {
		$this->join_name = "images";
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
	 * get the other language model for a master - creates one if it doesn't exist
	 *
	 * @param string $master 
	 * @param integer $lang_id 
	 * @return WaxModel - new language model
	 */
	private function get_language_model($master, $lang_id){
	  $model = new $this->model_class;
    if($lang_model = $model->filter(array('preview_master_id'=>$master->primval,'language'=>$lang_id))->first()){
      return $lang_model;
    }else{
	    Session::add_message("A {$this->languages[$lang_id]} version of this content has been created. The {$this->languages[0]} content was copied into it for convenience.");
	    //if a lang entry doesn't exist create one
		  foreach($master->columns as $col => $params)
		    if($master->$col) $copy_attributes[$col] = $master->$col;
		  $copy_attributes = array_diff_key($copy_attributes,array($master->primary_key=>false,'revisions'=>false)); //take out ID and revisions
		  
  	  $lang = new $this->model_class;
  	  $lang->save();
		  $lang->set_attributes($copy_attributes);
		  $lang->status = 5;
		  $lang->url = $master->url;
		  $lang->master = $master->primval;
		  $lang->language = $lang_id;
		  $lang->save();
		  return $lang;
    }
	}
	/**
	 * get the preview revision for a master - creates one if it doesn't exist
	 *
	 * @param string $master 
	 * @return WaxModel - existing copy of the model, new copy of the model, or the master itself
	 */
	private function get_preview_model($master){
		if(!in_array($master->status,array(1,6))) return $master; //pass through for everything but published articles
	  $preview = new $this->model_class;
	  $ret = $preview->filter("preview_master_id",$master->{$master->primary_key})->filter("status",4)->first();
	  if(!$ret){ //if a preview entry doesn't exist create one
      $preview->clear()->save(); //create preview model, needs an ID so associations will work
		  $preview_primval = $preview->primval(); //save new ID to put back later
		  foreach($master->columns as $col => $params) if($master->$col) $preview->$col = $master->$col; //copy all columns into the preview model
	    $preview->{$preview->primary_key} = $preview_primval;
      $preview->status = 4;
      $preview->preview_master_id = $master->primval;
    	$ret = $preview->save();
    	
    	//temp fix.... images not copying properly 
    	$preview->images= $master->images;
    	$preview->categories = $master->categories;
    }
    return $ret;
	}
	/**
	 * update the master with the preview's details, every field is updated except primary key and status
	 *
	 * @param string $preview 
	 * @param string $master 
	 * @return WaxModel - updated master
	 */
	private function update_master($preview, $master){
	  if($preview instanceOf $this->model_class && $preview->primval){
      $preview->set_attributes($_POST[$preview->table]);
      $preview->status = 4;
      $preview->save();
  	  foreach($preview->columns as $col => $params) if($preview->$col) $copy_attributes[$col] = $preview->$col;
  	  $copy_attributes = array_diff_key($copy_attributes,array_flip(array($preview->primary_key,"master","status"))); //take out IDs and status
	    $res = $master->update_attributes($copy_attributes);	    
    }else $res = $master;
    $this->after_save($res);
    return $res;
	}
	/**
	* the editing function... lets you change all the bits associated with the content record
	* gets the record for the id passed (/admin/content/edit/ID)
	* finds associated images & categories
	* render the partials
	*/
	public function edit() {
		if(($lang_id = Request::get("lang")) && (!$this->languages[$lang_id])){
	    Session::add_message("That language isn't allowed on your system. Here's the {$this->languages[0]} version instead.");
	    $this->redirect_to("/admin/".$this->module_name."/edit/$this->id");
    }

	  $this->id = WaxUrl::get("id");
		if(!$this->id) $this->id = $this->route_array[0];
    if(!($this->model = new $this->model_class($this->id))){
      $this->redirect_to(Session::get("list_refer"));
    }
    
    //if this is a revision, jump to the master
    if($this->model->preview_master_id) $this->redirect_to("/admin/".$this->module_name."/edit/".$this->model->preview_master_id."?lang=".$this->model->language);

    if($lang_id) $this->model = $this->get_language_model($this->model, $lang_id);
    $this->model = $this->get_preview_model($this->model);

    //this massive block handles the possible posts for save (default), publish and close
		if($this->model && $this->model->is_posted()){
  		if($_POST['close_x']) $this->redirect_to(Session::get("list_refer"));
  		elseif($_POST['publish_x']){
        if($this->model->status == 4){ //if we have a preview copy we should update the master and destroy the copy
	        $this->update_master($this->model, $this->model->master);
	        $this->model->delete();
	      }else{ //otherwise this is a first publish, and we should just save, forcing the status to be published
  		    $this->model->set_attributes($_POST[$this->model->table]);
  		    if($this->model->status == 5) $this->model->status = 6;
  		    else $this->model->status = 1;
  		    $this->model->save();
	      }
		    Session::add_message($this->display_name." "."Successfully Published");
		    $this->redirect_to(Session::get("list_refer"));
  	  }else{ //save button is default post, as it's the least destructive thing to do
  	    //unpublish a published article (i.e. current status is 4 and saving status back to 0 or 5)
  	    if(($this->model->status == 4) && (($_POST[$this->model->table]['status'] == 0) || ($_POST[$this->model->table]['status'] == 5))){
  	      $preview = $this->model;
          $this->model = $this->update_master($this->model, $this->model->master);
          $preview->delete();
  	    }
  	    $this->save($this->model, "/admin/$this->module_name/edit/".$this->model->id."/");
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
		$this->table_partial = $this->render_partial("wysi_tables");
		$this->form = $this->render_partial("form");
		
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
		$this->model = new $this->model_class(WaxUrl::get("id"));
		$category = new CmsCategory(substr($_POST["id"], 4));
		$this->model->categories = $category;
		if(!$this->attached_categories = $this->model->categories) $this->attached_categories= array();
		$cat = new CmsCategory;
		if(!$this->all_categories = $cat->all() ) $this->all_categories=array();		
		$this->cat_partial = $this->render_partial("list_categories");
	}
	/**
	* Ajax function - removes an association between a category and a content record
	* makes a view with new data
	**/
	public function remove_category() {
		$this->use_layout=false;
		$this->model = new $this->model_class(WaxUrl::get("id"));
		$category = new CmsCategory(Request::get("cat"));
		$this->model->categories->unlink($category);
    if(!$this->attached_categories = $this->model->categories) $this->attached_categories= array();
		$cat = new CmsCategory;
		if(!$this->all_categories = $cat->all() ) $this->all_categories=array();		
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
		if(!$this->all_categories = $cat->clear()->all()) $this->all_categories=array();		
		$this->cat_list = $this->render_partial("cat_list");	
	}
	/**
	* cool function that autosaves your current document via ajax call
	**/
	public function autosave() {
	  $this->id = Request::get("id");
	  $this->use_layout=false;
	  $this->use_view=false;
	  $content = new $this->model_class(Request::get("id"));
	  if($content->primval) {
	    $content->update_attributes($_POST["cms_content"]);
	    echo date("H:i:s");
	  }else{
	    throw new WXRoutingException('Tried to save in a non-existing database entry!', "Page not found", '404');
	  }
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
	  $this->content_results = array();
	  $this->model->filter(array("status"=>array(0,1)));
	  $this->use_layout=false;
	  if($input = Request::post("input")) {
	    $this->content_results = $this->model->filter("title LIKE '%$input%'")->order("published DESC")->limit(8)->all();
	  }
	}
	
	
}
?>
