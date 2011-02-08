<?php
/**
* Class defining basic building blocks of a CMS component
* Uses database to provide authentication
* @package PHP-WAX CMS
*/

class CMSBaseComponent extends WaxController {

	public $allowed_modules = array(); //all available modules for this user (ie this is just top level name)
	public $module_name = null;	//the name of this module
	public $model = false;	//the actuall database model to use
	public $model_class; //the class name - ie WildfireContent
	public $model_scope="admin";
	public $user_model_class = "WildfireUser";
	public $possible_parents = array(); //tree content	
	public $redirects = array('unauthorised'=> "/admin/login",
	                          'authorised' => "/admin/home/",
	                          'install'=> "/admin/install/",
	                          'logout'=>"/admin/logout"
	                          );
  public $use_plugin = "cms";
	public $display_name = 'CMS'; //display name of the module
  public $use_layout = "admin"; //the default layout to use	
	public $per_page = 20; //the limit to use in lists
	public $this_page = 1;
	
  public $user_session_name = "wf_v6_user";
  public $filter_fields=array();

	function __construct($application = false, $init=true) {
	  parent::__construct($application);
	  if($init) $this->initialise();
	}

	public function __destruct(){
	  $log = new WildfireLog;
	  $log->update_attributes(array('controller'=>$this->controller,
	                          'action'=>$this->action,
	                          'page'=>Request::get("id"),
	                          'param_string'=>serialize($_REQUEST),
	                          'language'=>Request::param('lang'),
	                          'wildfire_user_id'=>($this->current_user)?$this->current_user->primval:""
	                          ));

	}

  public function user_from_session($session_name="wf_v6_user"){
    if(($id = Session::get($session_name)) && ($model = new $this->user_model_class($id)) && $model->primval == $id) return $model;
    return false;
  }

	/**
	 * initialises authentication, default model and menu items
	 **/
	protected function initialise(){
	  $this->use_layout = "login";
	}
  
  

}
?>
