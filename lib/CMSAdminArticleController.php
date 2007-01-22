<?php
/**
* Article Controller
* Depends on CMSAuthorise.php to provide authentication
* @package PHP-WAX CMS
*/
class CMSAdminArticleController extends CMSAdminComponent {
	public $model_class = 'CmsArticle';
	public $model_name = "cms_article";													
	public $display_name = "Articles";
	
	public $scaffold_columns = array(
    "title"   =>array(),
    "page_status" => array()
  );
  public $filter_columns = array("title");
	public $allowed_images = 3;
	
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
	  $this->page = new $this->model_class($this->param("id"));
		$this->attached_images = array();
		$this->image_partial = $this->render_partial("page_images");
		parent::create();
	}
}
?>