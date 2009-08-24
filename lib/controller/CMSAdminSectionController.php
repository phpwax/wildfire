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
	}


	public function edit() {
    $this->model = new $this->model_class(Request::get("id"));
		$this->form();
	}
	
	public function create(){
		$this->possible_parents = array("None");
		foreach($this->model->tree() as $section){ //all sections
			$tmp = str_pad("", $section->get_level(), "*", STR_PAD_LEFT);
			$tmp = str_replace("*", "&nbsp;&nbsp;", $tmp);
			$this->possible_parents[$section->id] = $tmp.$section->title;
		}
	  parent::create();
	}

  public function create($save=true) {
  	$this->model = new $this->model_class();		
  	$this->form();
  	$this->form->default_page->editable=false;
  }
  
  public function form() {
    $this->use_view="form";
    $this->form = new WaxForm($this->model);
		if($_POST['cancel']) $this->redirect_to(Session::get("list_refer"));
		elseif($res = $this->form->save()) {
		  Session::add_message($this->display_name." ".$success);
		  $this->redirect_to(Session::get("list_refer"));
		}
  }
	
	/**
	* Ajax Filter list view
	*/
	public function filter() {
	  $this->use_layout=false;
	  $this->use_view="_list";
	  if($fil = Request::post('filter')) {
  		$conditions = "";
  	  if($this->filter_columns) {
  	    foreach($this->filter_columns as $filter) {
  	      $conditions .= "OR $filter LIKE ?";
  	      $params[]='%'.$fil.'%';
  	    }
  	    $conditions = ltrim($conditions, "OR");
      }
      $this->model->filter($conditions, $params);
	  }
	  $this->all_rows = $this->model->order($this->get_order())->limit($this->list_limit)->all();
	}


}

?>