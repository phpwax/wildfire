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
    
		$this->all_sections = $this->current_user->allowed_sections_model()->tree();
		$this->list_sections_partial = $this->render_partial("list_sections");
		$this->section_list_partial = $this->render_partial("section_list");
		$this->apply_sections_partial = $this->render_partial("apply_sections");
		
    $all_modules = CMSApplication::$modules;
    $operations = CmsPermission::$operations;
    $this->all_permissions =array();
    foreach($all_modules as $name => $info){
      if($name != "home" && $name != "settings"){
        foreach($operations as $key => $data) $this->all_permissions[] = array('module_name'=>$name, 'operation'=>$key);
      }
    }
    
    if(!$this->existing_permissions = $this->model->permissions) $this->existing_permissions = array();
		$this->exisiting_modules_partial = $this->render_partial("list_modules");
		$this->list_modules_partial = $this->render_partial("module_list");		
    $this->permissions_partial = $this->render_partial("modules");
		
    
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
	
	public function add_permission(){
	  $this->use_layout=$this->use_view=false;
	  $this->model = new $this->model_class(WaxUrl::get("id"));
	  $model = new CmsPermission;
    list($prefix, $module, $operation, $user_id) = explode("_",Request::param('tagid'));
   
    if($found = $model->filter("module_name", $module)->filter("operation", $operation)->first()) $found->delete();
    $model->clear();
    $model->module_name = $module;
    $model->operation = $operation;
    if($saved = $model->save()){
      $user = new $this->model_class($user_id);
      $user->permissions = $saved;
    }

    if(!$this->existing_permissions = $this->model->permissions) $this->existing_permissions = array();
    $this->use_view = "_list_modules";
	}
	
	public function remove_permission(){
	  $this->use_layout=$this->use_view=false;
	  $this->model = new $this->model_class(WaxUrl::get("id"));
	  $model = new CmsPermission(Request::param('cat'));
	  $this->model->permissions->unlink($model);
	  $model->delete();	  
    if(!$this->existing_permissions = $this->model->permissions) $this->existing_permissions = array();
    $this->use_view = "_list_modules";
	  
	}
	
	
}
?>