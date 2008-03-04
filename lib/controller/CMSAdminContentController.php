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
	public $edit_author = false;
	public $extra_content = array();
	public $extra_content_options = array();
	public $default_order = 'published';
	public $default_direction = 'DESC';
	/* run post delete triggers */
	protected $run_post_delete = true;
	protected $post_delete_function = "remove_joins";
	protected $post_delete_information = array( 'file_table'=>"cms_content_cms_file", 
																							'file_field'=>"cms_content_id", 
																							'category_table' => "cms_category_cms_content",
																							'category_field' => "cms_content_id");
	

	public function method_missing() {
	  if(!$page = $this->param("page")) $page=1;
		$this->use_view="index";
		$section = new CmsSection;
		$options = array("order"=>"published DESC", "page"=>$page, "per_page"=>10);
		$this->all_rows = $this->model->find_all_by_cms_section_id($section->find_by_url($this->action)->id, $options);
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
		$temp_content = $this->model->find_all( array('conditions'=>"`status`='3' AND `author_id`='$author_id' AND `date_created` < '$time' ") );
		if(count($temp_content)){
			foreach($temp_content as $content){
				$content->delete($content->id);
			}
		}
		/* */
		$this->display_action_name = 'List Items';
	  $options = array("order"=>"published DESC", "page"=>$page, "per_page"=>$this->list_limit, 'conditions'=>"`status` <> '3' ");
		$this->all_rows = $this->model->find_all($options);
		$this->filter_block_partial .= $this->render_partial("filter_block");
		$this->list = $this->render_partial("list");
	}
	
	public function add_image() {
		$this->use_layout=false;
		$this->page = new $this->model_class($this->route_array[0]);
		$this->page->add_images($_POST['id'], $this->param("order"));
		$file = new CmsFile;
		$this->image = $file->find($_POST['id']);
	}
	
	public function remove_image() {
		$this->use_layout=false;
		$page = new $this->model_class($this->route_array[0]);
		$page->delete_images($this->param("image"));
	}
	
	public function edit() {
		$this->page = new $this->model_class($this->route_array[0]);
		$this->attached_images = $this->page->images;
		if(!$this->attached_categories = $this->page->categories) $this->attached_categories= array();
		$cat = new CmsCategory;
		if(!$this->all_categories = $cat->find_all(array("order"=>"parent_id ASC, name ASC"))) $this->all_categories=array();
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
		$model = new CmsContent();
		$model->status = 3;
		$model->save();
		$this->redirect_to("/admin/content/edit/".$model->id);
	}
	
	public function add_category() {
	  $this->use_layout=false;
		$this->page = new $this->model_class($this->route_array[0]);
		$this->page->add_categories(substr($_POST["id"], 4));
		if(!$this->attached_categories = $this->page->categories) $this->attached_categories= array();
		$cat = new CmsCategory;
		if(!$this->all_categories = $cat->find_all(array("order"=>"parent_id ASC, name ASC"))) $this->all_categories=array();		
		$this->cat_partial = $this->render_partial("list_categories");
	}
	
	public function remove_category() {
		$this->use_layout=false;
		$this->page = new $this->model_class($this->route_array[0]);
		$this->page->delete_categories($this->param("cat"));
    if(!$this->attached_categories = $this->page->categories) $this->attached_categories= array();
		$cat = new CmsCategory;
		if(!$this->all_categories = $cat->find_all(array("order"=>"parent_id ASC, name ASC"))) $this->all_categories=array();		
		$this->cat_partial = $this->render_partial("list_categories");	
	}
	
	public function new_category() {
		$this->use_layout=false;
		$cat = new CmsCategory;
		$cat->name = $this->param("cat");
		$cat->save();
		if(!$this->all_categories = $cat->find_all(array("order"=>"parent_id ASC, name ASC"))) $this->all_categories=array();		
		$this->cat_list = $this->render_partial("cat_list");	
	}
}
?>