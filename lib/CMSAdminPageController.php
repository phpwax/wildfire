<?php
/**
* CMSAdminPageController - version controlled
* @package wxFramework
* @subpackage CMSPlugin
* @author WebXpress <john@webxpress.com>
* @version 1.0
*/

class CMSAdminPageController extends CMSAdminComponent{
	public $model_class = 'CmsPage';
	public $model_name = "cms_page";													
	public $display_name = "Pages";
	public $is_allowed = array('url'=>30,'published'=>30);
	public $scaffold_columns = array(
    "title"   =>array(),
    "page_status" => array()
  );
  public $filter_columns = array("title");
	public $allowed_images = 3;

	
	public function add_image() {
		$this->use_layout=false;
		$this->page = new CmsPage($this->param("id"));
		$this->page->add_images($_POST['id'], $this->param("order"));
		$this->image = $this->page->find_images($_POST['id']);
	}
	
	public function remove_image() {
		$this->use_layout=false;
		$page = new CmsPage($this->param("id"));
		$page->delete_images($this->param("image"));
	}
	
	public function edit() {
		$this->page = new CmsPage($this->param("id"));
		$this->attached_images = $this->page->images;
		$this->image_partial = $this->render_partial("page_images");
		parent::edit();
	}
	
	public function create() {
		parent::create();
		$this->attached_images = array();
	}
  
	
}
?>