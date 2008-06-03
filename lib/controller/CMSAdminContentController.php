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
    "title"   =>array(),
    "by" => array(),
    "page_status" => array(),
		"section_name" => array(),
		"date_published" => array()
  );
  public $filter_columns = array("title");
	public $allowed_images = 3;
	public $allowed_categories = true;
	public $edit_author = false;
	public $extra_content = array();
	public $extra_content_options = array();
	public $default_order = 'published';
	public $default_direction = 'DESC';
	
	

	public function method_missing() {
	  if(!$page = $this->param("page")) $page=1;
		$this->use_view="index";
		$section = new CmsSection;
		$sect_id = $section->find_by_url($this->action)->id;
		$this->all_rows = $this->model->filter(array('cms_section_id'=>$sect_id) )->order("published DESC")->page($page, 10);
		$this->filter_block_partial = $this->render_partial("filter_block");
		$this->list = $this->render_partial("list");
	}
	
	public function index() {
	  if(!$page = $this->param("page")) $page=1;
		/* 
			remove temporary files 
			- now using the date_created field to make sure that only files older than an hour created by the logged in user will be deleted. This is should
			avoid any acidental deletion of temp records that are still being worked on.
		*/
		$author_id = $this->current_user->id; 
		$time = date("Y-m-d H:i:s", mktime( date("H")-1, 0, 0, date("m"), date("d"), date("Y") ) );
		$temp_content = $this->model->filter(array('author_id'=>$author_id, 'status'=>3))->filter("`date_created` < '$time'")->all();
		if(count($temp_content)){
			foreach($temp_content as $content) $content->delete();
		}
		/* */
		$this->display_action_name = 'List Items';
		$this->all_rows = $this->model->clear()->filter("`status` <> '3' ")->order("published DESC")->page($page, $this->list_limit);
		$this->filter_block_partial .= $this->render_partial("filter_block");
		$this->list = $this->render_partial("list");
	}
	
	public function add_image() {
		$this->use_layout=false;
		$this->page = new $this->model_class(Request::get('id'));
		$file = new WildfireFile($_POST['id']);
		$this->page->images = $file;
		$this->image = $file;
	}
	
	public function remove_image() {
		$this->use_layout=false;
		$page = new $this->model_class(Request::get('id'));
		$image = new WildfireFile($this->param("image"));
		$page->images->unlink($image);
	}
	
	public function edit() {
		$this->page = new $this->model_class(WaxUrl::get("id"));
		if(!$this->attached_images = $this->page->images) $this->attached_images=array();
		if(!$this->attached_categories = $this->page->categories) $this->attached_categories= array();
		$cat = new CmsCategory;
		if(!$this->all_categories = $cat->order("parent_id ASC, name ASC")->all() ) $this->all_categories=array();
		$this->image_model = new WildfireFile;
		$this->image_partial = $this->render_partial("page_images");
		$this->cat_partial = $this->render_partial("list_categories");
		$this->cat_list = $this->render_partial("cat_list");
		$this->category_partial = $this->render_partial("apply_categories");
		$files = new WildfireFile();
		$this->all_links = $files->find_all_files();
		$this->link_partial = $this->render_partial("apply_links");
		parent::edit();
		$this->extra_content_partial = $this->render_partial("extra_content");
		$this->form = $this->render_partial("form");
	}
	
	public function create() {
		$model = new CmsContent();
		$model->status = 3;
		$model->author_id = Session::get('loggedin_user');
		$model = $model->save();
		$this->redirect_to("/admin/content/edit/".$model->id);
	}
	
	public function add_category() {
	  $this->use_layout=false;
		$this->page = new $this->model_class(WaxUrl::get("id"));
		$category = new CmsCategory(substr($_POST["id"], 4));
		$this->page->categories = $category;
		if(!$this->attached_categories = $this->page->categories) $this->attached_categories= array();
		$cat = new CmsCategory;
		if(!$this->all_categories = $cat->order("parent_id ASC, name ASC")->all() ) $this->all_categories=array();		
		$this->cat_partial = $this->render_partial("list_categories");
	}
	
	public function remove_category() {
		$this->use_layout=false;
		$this->page = new $this->model_class(WaxUrl::get("id"));
		$category = new CmsCategory(Request::get("cat"));
		$this->page->categories->unlink($category);
    if(!$this->attached_categories = $this->page->categories) $this->attached_categories= array();
		$cat = new CmsCategory;
		if(!$this->all_categories = $cat->order("parent_id ASC, name ASC")->all() ) $this->all_categories=array();		
		$this->cat_partial = $this->render_partial("list_categories");	
	}
	
	public function new_category() {
		$this->use_layout=false;
		$cat = new CmsCategory;
		$cat->name = Request::get("cat");
		$cat->save();
		if(!$this->all_categories = $cat->clear()->order("parent_id ASC, name ASC")->all()) $this->all_categories=array();		
		$this->cat_list = $this->render_partial("cat_list");	
	}
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
