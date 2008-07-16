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

class CMSAdminComponent extends WXControllerBase {

	public $all_modules = array(); //all available modules for this user
	public $module_name = null;	//the name of this module										
	public $model;	//the actuall database model to use
	protected $model_class; //the class name - ie CmsContent
	public $model_name;	//the db table name - ie cms_content
	protected $access = "0"; //the required access level
	protected $unauthorised_redirect="/admin/home/login"; //where to go to if user is not authorised
	protected $authorised_redirect="/admin/home/"; //default location on successfull auth
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

	/** scaffold columns can be overrided to specify what properties are listed
	* @var array
	**/
	public $scaffold_columns = null;
	public $filter_columns = null; //columns to use by the filter
	public $order_by_columns = array();	
	/** 
	* Construct method, initialises authentication, default model and menu items
	**/
	function __construct() {
		/**
		* authentication
		**/
		$auth = new WaxAuthDb(array("encrypt"=>false, "db_table"=>$this->auth_database_table, "session_key"=>"wildfire_user"));
		$this->current_user = $auth->get_user();
		if($this->current_user->usergroup==30) $this->is_admin=true;
		/**
		* module setup
		**/
		$this->before_filter("all", "check_authorised", array("login"));
		$this->configure_modules();
		$this->all_modules = CMSApplication::get_modules(true);
		if(!array_key_exists($this->module_name,CMSApplication::get_modules())){
			Session::add_message('This component is not registered with the application.');
			$this->redirect_to('/admin/home/index');
		}
		/**
		* model instanciation
		**/
		if($this->model_class) {
		  $this->model = new $this->model_class;
		  $this->model_name = WXInflections::underscore($this->model_class);
		  if (!$this->scaffold_columns && is_array($this->model->column_info())) {
        $this->scaffold_columns = array_keys($this->model->column_info());
      }
	  }
		$this->sub_links["create"] = "Create New ". $this->display_name;
		if(!$this->this_page = WaxUrl::get("page")) $this->this_page=1;
	}

	/**
	* Check if user authorised
	* @return boolean or redirect on fail
	*/
  public function check_authorised() {
    if($this->current_user) {
			if($this->access=="0") {
				return true;
			}
			if($this->current_user->usergroup >= $this->access) {
				return true;
			}
		}
		Session::add_message($this->unauthorised_message);
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
		$this->set_order();
		$this->display_action_name = 'List Items';

		$this->all_rows = $this->model->order($this->get_order())->page($this->this_page,$this->list_limit);
		if(!$this->all_rows) $this->all_rows=array();
		$this->filter_block_partial = $this->render_partial("filter_block");
		$this->list = $this->render_partial("list");
	}

	/**
	* Create model item - has shared view cms/view/CONTROLLER/_form.html
	*/
	public function create($save=true) {
		$this->display_action_name = 'Create';
		$this->model = new $this->model_class;		
		if($save) $this->save($this->model);
		$this->form = $this->render_partial("form");
	}
	
	/**
	* Edit model item in lightbox interface - has shared view cms/view/CONTROLLER/_form.html
	*/
	public function edit() {
		/* CHANGED - switched to url("id") as $this->param("id") is deprecated */
	  $this->id = WaxUrl::get("id");
		if(!$this->id) $this->id = $this->route_array[0];
    $this->model = new $this->model_class($this->id);
    if(!$this->model->is_posted()) {
      Session::set("cms_refer", $_SERVER['HTTP_REFERER']);
	  }
		$this->form = $this->render_partial("form");
		if($_POST['cancel']) $this->redirect_to(Session::get("cms_refer"));
		if($_POST['save']) $this->save($this->model, "edit");
		else $this->save($this->model, Session::get("cms_refer"));
	}
	
	/**
	* Ajax Filter list view
	*/
	public function filter() {
	  $this->use_layout=false;
	  if($_POST['filter']=="") {
	    $this->index();
	    return true;
	  }
		$conditions = "";
	  if($this->filter_columns) {
	    foreach($this->filter_columns as $filter) $conditions .= "OR $filter LIKE '%{$_POST['filter']}%'";
	    $conditions = ltrim($conditions, "OR");
    }
	  $this->all_rows = $this->model->filter($conditions)->order($this->get_order())->limit(30)->all();
		$this->list = $this->render_partial("list");
	}

	/**
	* Save
	* @param string $model 
	* @return boolean or redirect on success, sets message on success
	*/
	protected function save($model, $redirect_to=false, $success = "Successfully Saved") {
		if( $model->is_posted() ) {
			if($model->update_attributes($_POST[$this->model_name]) ) {
			  if($redirect_to =="edit") $redirect_to = "edit/".$model->id;
			  elseif(!$redirect_to) $redirect_to="index";
      	Session::add_message($this->display_name." ".$success);
      	$this->redirect_to($redirect_to);
			}
    }
 		return false;
	}
	
	/**
	* delete model record
	*/	
	public function delete(){
		$id = WaxUrl::get("id");
		if(!$id) $id = $this->route_array[0];
		
		if($id) { /*updated to new methods*/
			$field = $this->model->primary_key;
			$model= $this->model->clear()->filter($field.'='.$id)->first()->limit(false)->delete();
			Session::add_message("Item successfully deleted");
			
			$this->redirect_to("/".WaxUrl::get("controller")."/index");
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
	* creates the module listing - filters on user level
	**/
	protected function configure_modules() {
	  $config = CmsConfiguration::get("modules");
	  if(!is_array($mods = $config["enabled_modules"]) ) $mods = array(); 
	  if($mods && $this->current_user->usergroup != "30") {
	    foreach(CMSApplication::get_modules() as $module=>$values) {
        if(!array_key_exists($module, $mods)) {
          CMSApplication::unregister_module($module);
        }
      }
	  }
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
}
?>