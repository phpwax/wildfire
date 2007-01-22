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
	
	public function add_image() {
		$this->use_layout=false;
		$this->article = new $this->model_class($this->param("id"));
		$this->article->add_images($_POST['id'], $this->param("order"));
		$this->image = $this->article->find_images($_POST['id']);
	}
	
	public function remove_image() {
		$this->use_layout=false;
		$article = new $this->model_class($this->param("id"));
		$article->delete_images($this->param("image"));
	}
}
?>