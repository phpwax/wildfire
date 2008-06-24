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
    $this->sub_links["moderation"]="Comments in Moderation";
	}
	
	public function index( ) {
		$this->set_order();
		$this->display_action_name = 'List Comments';
		$this->all_rows = $this->model->filter(array('status'=>1))->order($this->get_order())->page($this->this_page, $this->list_limit);
		if(!$this->all_rows) $this->all_rows=array();
		$this->filter_block_partial = $this->render_partial("filter_block");
		$this->list = $this->render_partial("list");
	}
	
	public function moderation() {
	  $this->use_view="index";
	  $this->set_order();
		$this->display_action_name = 'Comments in Moderation';
		$this->all_rows = $this->model->filter(array('status'=>2))->order($this->get_order())->page($this->this_page, $this->list_limit);
		if(!$this->all_rows) $this->all_rows=array();
		$this->filter_block_partial = $this->render_partial("filter_block");
		$this->list = $this->render_partial("list");
	}
	
	public function spam() {
	  $comment = new CmsComment(Resquest::get("id"));
	  if($comment->update_attributes(array("status"=>"2")) ) {
	    Session::add_message("Comment marked as spam");
	  }
	  $this->redirect_to(array("action"=>"index"));
	}
	
	public function approve() {
	  $comment = new CmsComment(Resquest::get("id"));
	  if($comment->update_attributes(array("status"=>"1")) ) {
	    Session::add_message("Comment approved");
	  }
	  $this->redirect_to(array("action"=>"index"));
	}

}

?>