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
		$this->tree_collection = $this->model->sections_as_collection();
		if(count($this->tree_collection)) array_unshift($this->tree_collection, "None");
	}
	/**
	 * index page - list of all sections
	 */	
	public function index() {
		parent::index();
		$this->all_rows = $this->model->find_ordered_sections();
		if(!$this->all_rows) $this->all_rows = array();
		$this->list = $this->render_partial("list");
	}

}

?>