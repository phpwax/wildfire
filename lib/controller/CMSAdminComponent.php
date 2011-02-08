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

class CMSAdminComponent extends CMSBaseComponent {

	public $current_user=false; //the currently logged in

	public $filter_fields=array(
                          'text' => array('columns'=>array('title'), 'partial'=>'_filters_text')
	                      );
  //check user is allowed to do this!
  public function controller_global(){
    parent::controller_global();
    
    WaxEvent::add("cms.permissions.check_action", function() {
      $obj = WaxEvent::$data;
      if(!$obj->current_user->allowed(get_class($obj), $obj->action)) $obj->redirect_to($obj->redirects['unauthorised']);
    });
    WaxEvent::run("cms.permission.check_action", $this);
    
  }

	/**
	 * initialises authentication, default model and menu items
	 **/
	protected function initialise(){
	  WaxEvent::add("cms.permissions.logged_in_user", function() {
      $obj = WaxEvent::$data;
      if(!$obj->current_user = $obj->user_from_session($obj->user_session_name)) $obj->redirect_to($obj->redirects['unauthorised']);
    });
    
	  WaxEvent::add("cms.permissions.all_modules", function(){      
	    $obj = WaxEvent::$data;
	    foreach(CMSApplication::get_modules() as $name=>$info){
	      $class = "CMSAdmin".Inflections::camelize($name,true)."Controller";
	      if($obj->current_user->allowed($class, "index")) $obj->allowed_modules[$name] = $info;
	    }
    });
    WaxEvent::run("cms.permissions.logged_in_user", $this);
	  WaxEvent::run("cms.permissions.all_modules", $this);	  
	  
	}


	/**
	* Default view - lists all model items - has shared view cms/view/shared/list.html
	*/
	public function index(){}

	public function edit(){
	  $this->model = new $this->model_class(Request::get("id"));
		$this->form();
	}

	public function create(){
	  $this->model = new $this->model_class();
  	$this->form();
	}



}
?>
