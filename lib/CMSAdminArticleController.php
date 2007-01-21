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
    "page_status" => array()
  );
  public $filter_columns = array("title");
	
	
}
?>