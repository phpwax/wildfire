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

	public function controller_global() {
		$this->image_partial = $this->render_partial("page_images");
	}
	
	public function add_image() {
		$page = new CmsPage($this->param("id"));
		$page->add_images($this->route_array[1], $this->route_array[2]);
	}
	
	public function remove_image() {
		$page = new CmsPage($this->param("id"));
		$page->delete_images($this->route_array[1]);
	}
	
	public function edit() {
		parent::edit();
		$this->page = new CmsPage($this->param("id"));
		$this->attached_images = $this->page->images;
	}
	
	public function create() {
		parent::create();
		$this->attached_images = array();
	}
  
	
}
?>