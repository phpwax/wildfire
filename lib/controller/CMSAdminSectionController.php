<?php

class CMSAdminSectionController extends AdminComponent {

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
	public $allowed_default_page = false;
	public $permissions = array("create","edit","delete");
	/**
	* create the tree structure used for the drop down section selection
	**/
	public function controller_global() {
	  $this->model = $this->current_user->allowed_sections_model;
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

	/*new edit function - so include the link, video partials etc*/
	public function edit() {
    $model = new $this->model_class(WaxUrl::get("id"));
		$this->possible_parents = array("None");
		$remove_ids = array();
		foreach($model->tree() as $section) $remove_ids[] = $section->id; //only the subtree of the current node
		foreach($this->model->tree() as $section){ //all sections
		  if(!in_array($section->id, $remove_ids)){
  			$tmp = str_pad("", $section->get_level(), "*", STR_PAD_LEFT);
  			$tmp = str_replace("*", "&nbsp;&nbsp;", $tmp);
  			$this->possible_parents[$section->id] = $tmp.$section->title;
		  }
		}
		parent::edit();
	}

	/**
	 * ajax filter function - takes the incoming string, matches against columns 
	 * and outputs view of the matching data
	 */	
	public function filters() {
	  $this->use_layout = false;
	  $sect = new CmsSection();
  	$this->all_sections = $sect->filter("title LIKE '%$fil%'")->tree();
  	$this->use_view = "_section_list";
  	$this->all_sections_partial = $this->render_partial("section_list");
	}

}

?>