<?php
class AdminPagesController extends CMSAdminPageController {
  public $model = "cms_page";
  public $model_class = "CmsPage";
  public $scaffold_columns = array(
    "name"   =>array(),
		"author"   =>array(),
    "page_status" => array()
  );
  public $filter_columns = array("title", "url");
  
  
}
?>