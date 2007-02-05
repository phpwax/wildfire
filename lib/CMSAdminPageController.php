<?php
/**
* CMSAdminPageController
* @package PHP-WAX CMS
*/

class CMSAdminPageController extends CMSAdminComponent {
	public $module_name = "pages";												
	public $model_class = 'CmsPage';
	public $model_name = "cms_page";													
	public $display_name = "Pages";
	public $is_allowed = array('url'=>30,'published'=>30);
	public $scaffold_columns = array(
    "title"   =>array(),
    "page_status" => array(), 
		"section" => array()
  );
  public $filter_columns = array("title");
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
		$this->image_partial = $this->render_partial("page_images");
		parent::edit();
	}
	
	public function create() {
	  parent::create(false);
		$this->save($this->model, "edit", "successfully saved. Now you can use the tabs on the left to add more content");
	}
  
	
}
?>