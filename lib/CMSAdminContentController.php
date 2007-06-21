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
		"published" => array()
  );
  public $filter_columns = array("title");
	public $order_by_columns = array("title","status","published",'date_modified');
	public $allowed_images = 3;

	
	
	public function method_missing() {
		$this->use_view="index";
		$section = new CmsSection;
		$this->all_rows = $this->model->find_all_by_cms_section_id($section->find_by_url($this->action)->id);
		$this->filter_block_partial = $this->render_partial("section_filter");
		$this->list = $this->render_partial("list");
	}
	
	public function index() {
		parent::index();
		$this->filter_block_partial .= $this->render_partial("section_filter");
		$this->list = $this->render_partial("list");
	}
	
	
	public function add_image() {
		$this->use_layout=false;
		$this->page = new $this->model_class($this->param("id"));
		$this->page->add_images($_POST['id'], $this->param("order"));
		$this->image = $this->page->find_images($_POST['id']);
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
		
		$this->image_partial = $this->render_partial("page_images");
		$this->category_partial = $this->render_partial("apply_categories");
		$files = new CmsFile();
		$this->all_links = $files->find_all_files();
		$this->link_partial = $this->render_partial("apply_links");
		parent::edit();
	}
	
	public function set_categories() {
	  $this->use_layout=false;
	  $this->use_view=false;
		$page = new $this->model_class($this->param("id"));
		$page->clear_categories();
		foreach($_POST['cats'] as $cat=>$val) {
		  if($page->add_categories($val)) echo "Added category $val";
		}
		exit;
	}
	
	public function create() {
	  $files = new CmsFile();
		$this->all_links = $files->find_all_files();
		$this->link_partial = $this->render_partial("apply_links");
	  parent::create(false);
	  if($this->allowed_images) $this->save($this->model, "edit", "successfully saved. Now you can use the icons on the toolbar to add images and categories");
    else $this->save($this->model);
	}
}
?>