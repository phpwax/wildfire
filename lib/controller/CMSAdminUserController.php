<?php
/**
 * controller to handle the users - inherits from admin component
 * @package PHP-WAX CMS
 */

class CMSAdminUserController extends AdminComponent {
  public $module_name = "users";
  public $model_class = 'WildfireUser';
	public $model_name = "wildfire_user";
	public $display_name = "CMS Users";
	public $scaffold_columns = array(
    "username"   =>array("link"=>true),
		"email" =>  array("link"=>true),
		"firstname" =>  array("link"=>true),
		"surname" =>  array("link"=>true)
  );
  public $filter_columns = array("username", "email");
	public $order_by_columns = array("username","email");
	
	public function controller_global(){
	  $this->model->filter("usergroup <= ".$this->current_user->usergroup);
	  parent::controller_global();
	}

	public function edit() {
		/* CHANGED - switched to url("id") as $this->param("id") is deprecated */
	  $this->id = WaxUrl::get("id");
		if(!$this->id) $this->id = $this->route_array[0];
    $this->model = new $this->model_class($this->id);
    
    $sect = new CmsSection();
		$this->all_sections = $sect->tree();
		$this->list_sections_partial = $this->render_partial("list_sections");
		$this->section_list_partial = $this->render_partial("section_list");
		$this->apply_sections_partial = $this->render_partial("apply_sections");

		$this->form = $this->render_partial("form");
		if($_POST['cancel']) $this->redirect_to(Session::get("list_refer"));
		if($_POST['save']) $this->save($this->model, "edit");
		else $this->save($this->model, Session::get("list_refer"));
	}
	/**
	* Ajax function - associates a section with a user
	* creates a view with resulting info
	**/
	public function add_section() {
	  $this->use_layout = false;
		$this->model = new $this->model_class(WaxUrl::get("id"));
		$section = new CmsSection(substr($_POST["id"], 4));
		$this->model->allowed_sections = $section;
		$sect = new CmsSection;
		$this->all_sections = $sect->all();
		$this->use_view = "_list_sections";
	}
	/**
	* Ajax function - removes an association between a section and a user
	* makes a view with new data
	**/
	public function remove_section() {
		$this->use_layout=false;
		$this->model = new $this->model_class(WaxUrl::get("id"));
		$section = new CmsSection(Request::get("sect"));
		$this->model->allowed_sections->unlink($section);
		$sect = new CmsSection;
		$this->all_sections = $sect->all();
		$this->use_view = "_list_sections";
	}
}
?>