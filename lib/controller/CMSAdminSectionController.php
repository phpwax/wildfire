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

	/**
	* create the tree structure used for the drop down section selection
	**/
	public function controller_global() {
		$this->tree_collection = array("None");
		foreach($this->model->tree() as $section){
			$tmp = str_pad("", $section->get_level(), "*", STR_PAD_LEFT);
			$tmp = str_replace("*", "&nbsp;&nbsp;", $tmp);
			$this->tree_collection[$section->id] = $tmp.$section->title;
		}
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
		$this->page = new $this->model_class(WaxUrl::get("id"));
		$files = new WildfireFile();
		$this->all_links = $files->find_all_files();
		$this->link_partial = $this->render_partial("apply_links");
		//parent edit function - this handles the save etc
		parent::edit();
		$this->flash_files = $files->flash_files();
		$this->video_partial = $this->render_partial("apply_video");
		$this->form = $this->render_partial("form");
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