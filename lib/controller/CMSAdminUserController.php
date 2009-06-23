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
	  $this->model->filter("usergroup", $this->current_user->usergroup, "<=");
	  parent::controller_global();
	}

  public function create(){
    //find the required fields and give them default values
		foreach($this->model->columns as $name=>$values){
			if($values[1] && ($values[1]['required'] || !$values[1]['blank']) && !$values[1]['target_model']) $this->model->$name = $values[1]['default'];
		}
		$saved = $this->model->save();
		$this->redirect_to("/admin/users/edit/".$saved->primval."/");
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
    $permissions = new CmsPermission;
    $this->all_permissions = $permissions->filter("module", "settings", "!=")->filter("module", "home", "!=")->all();
    
    if(!$this->existing_permissions = $this->model->permissions) $this->existing_permissions = array();
    elseif($this->existing_permissions && $this->existing_permissions->count()){
      $ids = array();
      foreach($this->existing_permissions as $perm) $ids[] = $perm->primval;
      $this->existing_permissions = $permissions->clear()->filter(array("id"=> $ids))->order('module')->all();
    }
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
    list($prefix, $module_id) = explode("_",Request::param('tagid'));
    $found = new CmsPermission($module_id);
    if($found->primval){
      $user = new $this->model_class(WaxUrl::get("id"));
      $found->allowed = 1;
      $user->permissions = $found;
      $user->save();
    }

    if(!$this->existing_permissions = $this->model->permissions) $this->existing_permissions = array();
    elseif($this->existing_permissions && $this->existing_permissions->count()){
      $ids = array();
      foreach($this->existing_permissions as $perm) $ids[] = $perm->primval;
      $this->existing_permissions = $permissions->clear()->filter(array("id"=> $ids))->order('module')->all();
    }
    
    $this->use_view = "_list_modules";
	}
	
	public function remove_permission(){
	  $this->use_layout=$this->use_view=false;
	  $this->model = new $this->model_class(WaxUrl::get("id"));
	  $model = new CmsPermission(Request::param('cat'));
	  $this->model->permissions->unlink($model);
    if(!$this->existing_permissions = $this->model->permissions) $this->existing_permissions = array();
    elseif($this->existing_permissions && $this->existing_permissions->count()){
      $ids = array();
      foreach($this->existing_permissions as $perm) $ids[] = $perm->primval;
      $this->existing_permissions = $permissions->clear()->filter(array("id"=> $ids))->order('module')->all();
    }
    $this->use_view = "_list_modules";
	  
	}
	
	/**
	 * conversion routine to new permissions based system
	 */	
	public function convert_to_v3(){
	  $this->use_view = $this->use_layout = false;
	  
    $user = new $this->model_class;
    $modules = $registered = CMSApplication::$modules;   
    $permission = new CmsPermission; 
    foreach($modules as $name => $row){
      foreach(CmsPermission::$operations as $key=>$op){
        if(!$found = $permission->clear()->filter("module", $name)->filter("operation", $key)->first()){
          $perm = new CmsPermission;
          $perm->module = $name;
          $perm->operation = $key;
          $perm->save();        
        }
      }
    }
    
    $config = CmsConfiguration::get('modules');
    $registered = $config['enabled_modules'];
    $user_model = new $this->model_class;
    $permission = new CmsPermission;
    foreach($user_model->clear()->all() as $user){
      if($user->usergroup == 30) $all_mods = CMSApplication::$modules;
      else $all_mods = $registered;
      foreach($all_mods as $module=>$info){
        foreach(CmsPermission::$operations as $key=>$op){
          if($op != "ADMIN"){
            if($found = $permission->clear()->filter("module", $module)->filter("operation", $key)->first()){          
              $found->allowed = 1;
              $user->permissions = $found;
              $user->save();
            }
          }
        }
      }
    }
    CmsConfiguration::set('cms_warning_permissions', 1);
    Session::add_message('cms users have been converted...');
    $this->redirect_to("/admin/home/");
	}
	
	
}
?>