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
    "page_status" => array(),
		"section" => array(),
		"date_published" => array()
  );
  public $filter_columns = array("title");
	public $allowed_images = 3;
	public $allowed_categories = true;
	public $extra_content = array();

	public function method_missing() {
	  if(!$page = url("page")) $page=1;
		$this->use_view="index";
		$section = new CmsSection;
		$options = array("order"=>"published DESC", "page"=>$page, "per_page"=>10);
		$this->all_rows = $this->model->find_all_by_cms_section_id($section->find_by_url($this->action)->id, $options);
		$this->filter_block_partial = $this->render_partial("filter_block");
		$this->list = $this->render_partial("list");
	}
	
	public function index() {
	  if(!$page = url("page")) $page=1;
		$this->display_action_name = 'List Items';
	  $options = array("order"=>"published DESC", "page"=>$page, "per_page"=>10);
		$this->all_rows = $this->model->find_all($options);
		$this->filter_block_partial .= $this->render_partial("filter_block");
		$this->list = $this->render_partial("list");
	}
	
	public function add_image() {
		$this->use_layout=false;
		$this->page = new $this->model_class($this->param("id"));
		$this->page->add_images($_POST['id'], $this->param("order"));
		$file = new CmsFile;
		$this->image = $file->find($_POST['id']);
	}
	
	public function remove_image() {
		$this->use_layout=false;
		$page = new $this->model_class($this->param("id"));
		$page->delete_images($this->param("image"));
	}
	
	public function edit() {
		$this->page = new $this->model_class($this->param("id"));
		$this->attached_images = $this->page->images;
		if(!$this->attached_categories = $this->page->categories) $this->attached_categories= array();
		$cat = new CmsCategory;
		if(!$this->all_categories = $cat->find_all()) $this->all_categories=array();
		$this->image_model = new CmsFile;
		$this->image_partial = $this->render_partial("page_images");
		$this->cat_partial = $this->render_partial("list_categories");
		$this->cat_list = $this->render_partial("cat_list");
		$this->category_partial = $this->render_partial("apply_categories");
		$files = new CmsFile();
		$this->all_links = $files->find_all_files();
		$this->link_partial = $this->render_partial("apply_links");
		parent::edit();
		$this->extra_content_partial = $this->render_partial("extra_content");
		$this->form = $this->render_partial("form");
	}
	
	public function create() {
	  $files = new CmsFile();
	  $this->allowed_images = false;
  	$this->allowed_categories = false;
		$this->all_links = $files->find_all_files();
		$this->link_partial = $this->render_partial("apply_links");
	  parent::create(false);
	  if($this->allowed_images) $this->save($this->model, "edit", "successfully saved. Now you can use the extra tabs to add images and categories");
    else $this->save($this->model);
	}
	
	public function add_category() {
	  $this->use_layout=false;
		$this->page = new $this->model_class($this->param("id"));
		$this->page->add_categories(substr($_POST["id"], 4));
		if(!$this->attached_categories = $this->page->categories) $this->attached_categories= array();
		$cat = new CmsCategory;
		if(!$this->all_categories = $cat->find_all()) $this->all_categories=array();		
		$this->cat_partial = $this->render_partial("list_categories");
	}
	
	public function remove_category() {
		$this->use_layout=false;
		$this->page = new $this->model_class($this->param("id"));
		$this->page->delete_categories($this->param("cat"));
    if(!$this->attached_categories = $this->page->categories) $this->attached_categories= array();
		$cat = new CmsCategory;
		if(!$this->all_categories = $cat->find_all()) $this->all_categories=array();		
		$this->cat_partial = $this->render_partial("list_categories");	
	}
	
	public function new_category() {
		$this->use_layout=false;
		$cat = new CmsCategory;
		$cat->name = url("cat");
		$cat->save();
		if(!$this->all_categories = $cat->find_all()) $this->all_categories=array();		
		$this->cat_list = $this->render_partial("cat_list");	
	}
}
?>