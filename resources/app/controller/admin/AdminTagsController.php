<?php
class AdminTagsController extends CMSAdminTagController {
  public $model = "cms_tag";
  public $model_class = "CmsTag";
  public $scaffold_columns = array(
    "name"   =>array()
  );
  public $filter_columns = array("name");
  
  
}
?>