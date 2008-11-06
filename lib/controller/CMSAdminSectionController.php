<?php

class CMSAdminSectionController extends CMSAdminComponent {

  public $module_name = "sections";												
  public $model_class = 'CmsSection';
	public $model_name = "cms_section";													
	public $display_name = "Site Sections";
	public $scaffold_columns = array(
    "title"   =>array("link"=>"edit"),
		"url" =>  array()
  );
  public $filter_columns = array("title");
	public $order_by_columns = array("title","url");

	/**
	* create the tree structure used for the drop down section selection
	**/
	public function controller_global() {
	  $this->tree_collection = array("None");
	  $sections_as_collection = $this->model->sections_as_collection();
		foreach($this->model->sections_as_collection() as $id => $section) $this->tree_collection[$id] = $section;
	}
	/**
	 * index page - list of all sections
	 */	
	public function index() {
	  Session::set("list_refer", $_SERVER['REQUEST_URI']);
		$this->set_order();
		$this->display_action_name = 'List Items';
		$this->all_rows = $this->model->tree();
		if(!$this->all_rows) $this->all_rows = array();
		$this->filter_block_partial = $this->render_partial("filter_block");
		$this->list = $this->render_partial("list");
	}

}

?>