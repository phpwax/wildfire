<?php

class CMSAdminCommentController extends CMSAdminComponent {

  public $module_name = "comments";												
  public $model_class = 'CmsComment';
	public $model_name = "cms_comment";													
	public $display_name = "Comments";
	public $scaffold_columns = array(
    "author_name"   =>array(),
    "comment"   =>array(),
    "time"   =>array(),
  );
  public $filter_columns = array("name");
  

	public function controller_global() {

	}

}

?>