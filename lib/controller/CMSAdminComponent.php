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
  
  //check user is allowed to do this!
  public function controller_global(){
    parent::controller_global();
    WaxEvent::add("cms.permission_check", function(){});
  }

	/**
	 * initialises authentication, default model and menu items
	 **/
	protected function initialise(){
	  if(!$this->current_user = $this->user_from_session($this->user_session_name)) $this->redirect_to($this->redirects['unauthorised']);
	   
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
