<?php
/**
* Article Controller
* Depends on CMSAuthorise.php to provide authentication
* @package wxFramework
* @subpackage CMSPlugin
* @author WebXpress <john@webxpress.com>
* @version 1.0
*/
class CMSAdminArticleController extends CMSAdminComponent {
	public $model_class = 'CmsArticle';
	public $model_name = "cms_article";													
	public $display_name = "Articles";
	
	public $scaffold_columns = array(
    "title"   =>array(),
    "published" => array()
  );
  public $filter_columns = array("title");
	
	/**
	* Create array of tags before executing parent method
	*/
	public function create() {
		$file_model = new CmsFile;
		$this->images = $file_model->find_all(array('conditions'=>'type LIKE "image%"'));
		$tag_model = new CmsTag;
	  $this->tags = $tag_model->find_all();
		parent::create();
	}
	
	/**
	* Create array of tags before executing parent method
	*/	
	public function edit() {
		$file_model = new CmsFile;
		$this->images = $file_model->find_all(array('conditions'=>'type LIKE "image%"'));
		$tag_model = new CmsTag;
	  $this->tags = $tag_model->find_all();
		parent::edit();
	}
}
?>