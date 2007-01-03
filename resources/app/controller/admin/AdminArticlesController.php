<?php
class AdminArticlesController extends CMSAdminArticleController {
  public $model = "cms_article";
  public $model_class = "CmsArticle";
  public $scaffold_columns = array(
    "title"   =>array(),
		"author"   =>array(),
    "page_status" => array()
  );
  public $filter_columns = array("title", "url");
  
  
}
?>