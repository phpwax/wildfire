<?php
/**
* Class defining minimum requirments for CMS component
* Depends on CMSAuthorise.php to provide authentication
* @package wxFramework
* @subpackage CMSPlugin
* @author WebXpress <john@webxpress.com>
* @version 1.0
*/

Autoloader::include_from_registry('CMSHelper');
Autoloader::register_helpers();

class CMSAdminComponent extends WXControllerBase {
	public $model;	
	protected $model_class;
	public $model_name;													
	protected $access = "0";
	protected $unauthorised_redirect="/admin/home/login";
	protected $current_user=false;
	public $auth_database_table="CmsUser";
	public $use_plugin = "cms";
	public $use_layout = "admin";
	public $sub_links;
	public $display_name = 'CMS';
	public $list_limit = 20;
	public $default_order = "id";
	public $default_direction="ASC";
	public $is_admin=false;
	public $is_allowed = array();
	/** scaffold columns can be overrided to specify
	* @var array
	**/
	public $scaffold_columns = null;
	public $filter_columns = null;
	
	/** 
	* Construct method, initialises authentication, default model and menu items
	**/
	function __construct() {
		$auth = new CMSAuthorise($this->auth_database_table);
		$this->current_user = $auth->get_user();
		if($this->current_user->usergroup>0) $this->is_admin=true;
		$this->before_filter("all", "check_authorised", array("login"));
		if($this->model_class) {
		  $this->model = new $this->model_class;
		  $this->model_name = WXInflections::underscore($this->model_class);
		  if (!$this->scaffold_columns) {
			  $this->scaffold_columns = array_keys($this->model->column_info());
		  }
	  }
		$this->sub_links["create"] = "Create New ". $this->display_name;
		if($this->param("page")) {
		  $this->page_no = $this->param("page");
	    $this->list_offset = ($this->page_no * $this->list_limit);
	  }
		
		// used to set permissions on interface elements - use if($is_allowed['id']) to test
		foreach($this->is_allowed as $model_attribute=>$permission){
			if($this->current_user->usergroup >= $permission) $this->is_allowed[$model_attribute] = true;
			else $this->is_allowed[$model_attribute] = false;
		}
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
		Session::add_message("Please login to continue");
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
		$this->display_action_name = 'List Items';
	  $options = array("order"=>$this->default_order." ".$this->default_direction);
		$this->all_rows = $this->model->paginate($this->list_limit, $options);
		if(!$this->all_rows) $this->all_rows=array();
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
	  $this->id = $this->param("id");
    $this->model = new $this->model_class($this->id);
		$this->form = $this->render_partial("form");
		$this->save($this->model);
	}
	
	/**
	* Ajax Filter list view
	*/
	public function filter() {
	  $this->use_layout="ajax";
	  if($_POST['filter']=="") {
	    $this->index();
	    return true;
	  }
	  $default = array("order"=>$this->default_order." ".$this->default_direction);
	  $options = $this->param("order") ? array("order"=>$this->param("order")) : $default;
	  if($this->filter_columns) {
	    foreach($this->filter_columns as $filter) {
  	    $conditions .= "OR $filter LIKE '%{$_POST['filter']}%'";
  	  }
	    $conditions = ltrim($conditions, "OR");
	    $options = array_merge($options, array("conditions"=>$conditions));
    }
	  $this->all_rows = $this->model->find_all($options);
		$this->list = $this->render_partial("list");
	}

	/**
	* Save
	* @param string $model 
	* @return boolean or redirect on success, sets message on success
	*/
	protected function save($model, $redirect="../index", $success = "Successfully Saved") {
		if( $model->is_posted() ) {
			$model->author_id = $this->current_user->id;
			//remove post var when user has no permissions
			foreach($this->is_allowed as $permission){
				if($permission == false) unset($_POST[$permission]);
			}
			if($model->update_attributes($_POST[$this->model_name]) ) {
      	Session::add_message($this->display_name." Successfully Saved");
      	$this->redirect_to('../index');
			}
    }
 		return false;
	}
	
	/**
	* delete model record
	*/	
	public function delete(){
		if($id = $this->param('id')) {
			$this->model->delete($id);
			Session::add_message("Item successfully deleted");
			$this->redirect_to('../index');
		}
	}
	
	
}
?>