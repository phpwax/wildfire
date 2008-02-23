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
  public $filter_columns = array("author_name");
  public $default_order = "time";
	public $default_direction="DESC";
  

	public function controller_global() {

	}
	
	public function spam() {
	  $comment = new CmsComment($this->param("id"));
	  if($comment->update_attributes(array("status"=>"2")) ) {
	    Session::add_message("Comment marked as spam");
	  }
	  $this->redirect_to(array("action"=>"index"));
	}
	
	public function approve() {
	  $comment = new CmsComment($this->param("id"));
	  if($comment->update_attributes(array("status"=>"1")) ) {
	    Session::add_message("Comment approved");
	  }
	  $this->redirect_to(array("action"=>"index"));
	}ß

}

?>