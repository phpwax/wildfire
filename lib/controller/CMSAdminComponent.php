<?php
/**
* Class defining basic building blocks of a CMS component
* Uses database to provide authentication
* @package PHP-WAX CMS
*/
/**
 * load in the cms helper file
 */
Autoloader::include_from_registry('CMSHelper');
Autoloader::register_helpers();

class CMSAdminComponent extends WaxController {

	public $all_modules = array(); //all available modules for this user
	public $module_name = null;	//the name of this module										
	public $model;	//the actuall database model to use
	protected $model_class; //the class name - ie CmsContent
	public $model_name;	//the db table name - ie cms_content
	protected $access = 0; //the required access level
	protected $unauthorised_redirect="/admin/home/login"; //where to go to if user is not authorised
	protected $authorised_redirect="/admin/home/"; //default location on successfull auth
	protected $no_users_redirect="/admin/home/install"; //default location when no users exist in the database
	protected $no_users_message="No users detected. Please provide user details for an administrator."; //default location when no users exist in the database
	protected $unauthorised_message="Please login to continue"; //status message
	public $current_user=false; //the currently logged in 
	public $auth_database_table="wildfire_user"; //the database table to use for authentication
	public $use_plugin = "cms"; //the plugin
	public $use_layout = "admin"; //the default layout to use
	public $sub_links; //section sub menu is generated from these
	public $display_name = 'CMS'; //display name of the module
	public $list_limit = 20; //the limit to use in lists
	public $default_order = "id"; //default order by field
	public $default_direction="ASC"; //order by direction
	public $is_admin=false; //flag set if the user is highest level admin
	public $config; //config details
	public $allowed_images = false; //if a number then allows the use images to be attached (cms_content only by default)
	public $allowed_categories = false; //if true then allows the use of categories (cms_content only by default)


  public $base_help = array('CMS Overview'=>array('file' => "/help/wildfire_cms_help.pdf"));
  public $extra_help = array();
  public $help_files = array(); //merged result of the 2 above
  public $help_titles = array('index' => 'Listing', 'edit'=>'Editing', 'create'=>'Creating');

	/** scaffold columns can be overrided to specify what properties are listed
	* @var array
	**/
	public $scaffold_columns = null;
	public $filter_columns = null; //columns to use by the filter
	public $order_by_columns = array();
	
	//default permissions on each module, view and menu are separate to allow you to get lists of things without showing that module in the menu structure
	public $base_permissions = array("enabled","menu");
	public $permissions = array();
	
	function __construct($initialise = true) {
	  parent::__construct($initialise);
	  $this->permissions = array_unique(array_merge($this->base_permissions,$this->permissions));
	  $this->help_files = array_unique(array_merge($this->extra_help, $this->base_help));
	  if($initialise) $this->initialise();
	}
	
	public function __destruct(){
	  $log = new WildfireLog;
	  $log->controller=$this->controller;
		$log->action=$this->action;
		$log->page=$this->id;
		if(Request::param('lang')) $log->language = Request::param('lang');
		$log->user=$this->current_user->id;
		$log->time = date("Y-m-d H:i:s");
		$log->save();
	}
	
	
	/** 
	* initialises authentication, default model and menu items
	**/
	private function initialise() {

		$auth = new WaxAuthDb(array("encrypt"=>false, "db_table"=>$this->auth_database_table, "session_key"=>"wildfire_user_cookie"));
		$this->current_user = $auth->get_user();
		if($this->current_user) $this->current_user->fetch_permissions();

		$this->all_modules = $this->configure_modules();
		$this->menu_modules = $this->configure_modules('menu');
	
	  if(!in_array(Request::get("action"),array("login","install"))) $this->check_authorised();
		
		if(!array_key_exists($this->module_name, $this->all_modules)){
			Session::add_message('This component is not registered with the application.');
			$this->redirect_to('/admin/home/index');
		}
		
		if($this->model_class) {
		  $this->model = new $this->model_class;
		  $this->model_name = WXInflections::underscore($this->model_class);
		  if (!$this->scaffold_columns && is_array($this->model->column_info())) {
        $this->scaffold_columns = array_keys($this->model->column_info());
      }
	  }
	  
		if($this->current_user && $this->current_user->access($this->module_name,"create")) $this->sub_links["create"] = "Create New ". $this->display_name;
		
		if(!$this->this_page = Request::get("page")) $this->this_page=1;
	}

	/**
	* Check if user authorised
	* @return boolean or redirect on fail
	*/
  public function check_authorised() {
    if($this->current_user) return $this->current_user->access($this->module_name, 'view');
		Session::add_message($this->unauthorised_message);
		Session::set('pre_login_referrer', $_SERVER['REQUEST_URI']);
		$this->redirect_to($this->unauthorised_redirect);
  }

	/**
	* Returns access level of specified users role as a integer
	* @param string $role_name 
	* @return integer $access_level
	*/
	public function get_access_level($role_name) {
		return $this->roles_array[$role_name];
	}

	/**
	* Default view - lists all model items - has shared view cms/view/shared/list.html 
	*/
	public function index( ) {
	  Session::set("list_refer-".$this->module_name, $_SERVER['REQUEST_URI']);
		$this->set_order();
		$this->display_action_name = 'List '.$this->display_name;
		$this->all_rows = $this->model->order($this->get_order())->page($this->this_page,$this->list_limit);
	}

	public function edit() {
	  $this->model = new $this->model_class(Request::get("id"));
		$this->form();
	}
	
	public function create() {
	  $this->model = new $this->model_class();		
  	$this->form();
	}
	
	public function form() {
    $this->use_view="form";
    $this->form = new WaxForm($this->model);
		if(post('cancel')) $this->redirect_to(Session::get("list_refer"));
		elseif($res = $this->form->save()) {
		  Session::add_message($this->display_name." Successfully Saved");
		  $this->redirect_to(Session::get("list_refer"));
		}
  }
	
	/**
	* Ajax Filter list view
	*/
	public function filter() {
	  $this->use_layout=false;
	  if($filter_val = Request::param('filter')) {
  		$conditions = "";
  	  if($this->filter_columns) {
  	    foreach($this->filter_columns as $col) $conditions .= "OR $col LIKE '%".$filter_val."%'";
  	    $conditions = ltrim($conditions, "OR");
      }
      $this->model->filter($conditions);
	  }
	  $this->all_rows = $this->model->order($this->get_order())->limit($this->list_limit)->all();
	  $this->use_view="_list";
	}

	/**
	* Save
	* @param string $model 
	* @return boolean or redirect on success, sets message on success
	*/
	protected function save($model, $redirect_to=false, $success = "Successfully Saved") {
	  $this->before_save($model);
		if( $model->is_posted() ) {
			if($model->update_attributes($_POST[$this->model->table]) ) {
			  if($redirect_to == "edit") $redirect_to = "/$this->controller/edit/".$model->id."/";
			  elseif(!$redirect_to) $redirect_to = "/$this->controller/index";
      	Session::add_message($this->display_name." ".$success);
      	$this->after_save($model);
      	$this->redirect_to($redirect_to);
			}elseif(count($model->errors)){
			  foreach($model->errors as $errors){
			    foreach($errors as $err) Session::add_error($err);
		    }
			}
    }
 		return false;
	}
	
	protected function before_save($model){}
	protected function after_save($model){}	
	/**
	* delete model record
	*/	
	public function delete(){
		$id = Request::get("id");
		if(!$id) $id = $this->route_array[0];
		
		if($id) { /*updated to new methods*/
			$field = $this->model->primary_key;
			$model= $this->model->clear()->filter($field.'='.$id)->first()->limit(false)->delete();
			Session::add_message("Item successfully deleted");
			
			$this->redirect_to("/".Request::get("controller")."/index");
		}
	}
	
	
	/**
	* sets the default ordering for the lists
	**/
	protected function set_order(){
		if($order = $_GET['order']) {
			if(in_array($order,$this->describe_model())){
				$current_order = $this->get_order();
				$current_order_parts = explode(' ',$current_order);
				if(!$current_order_parts[1] || $current_order_parts[1] == 'DESC') $order = "{$order} ASC";
				else $order = "{$order} DESC";
				Session::set("{$this->model_name}",$order);
			}
		}
		else return false;
	}
	/**
	* looks up the session order vaules
	* @return string containing order by for models
	**/
	protected function get_order(){
		if($order = Session::get("{$this->model_name}")) return $order;
		else return "{$this->default_order} {$this->default_direction}";
	}
	/**
	* uses the permission system to look if you have access to perform the passed in operation
	* @return array - a list of modules you have access to for that operation
	**/
	protected function configure_modules($operation = "enabled") {
	  $modules = array('home' => CMSApplication::$modules['home']); //add the home module by default
	  if($this->current_user && $this->current_user->primval){
      foreach(CMSApplication::$modules as $name => $settings){
	      if($this->current_user->access($name, $operation)) $modules[$name] = $settings;
	    }
	  }
	  return $modules;
	}
	/**
	* uses the models description function to get an array of fields
	* @return array of field names
	**/
	protected function describe_model(){
		$model_desc = $this->model->describe();
		foreach($model_desc as $field) $desc[] = $field['Field'];
		return $desc;
	}
	
	public function help(){}
	
}
?>
