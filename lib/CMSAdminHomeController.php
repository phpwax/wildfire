<?php
/**
* Abstract class defining minimum requirments for CMS component
* @package wxFramework
* @subpackage CMSPlugin
* @author WebXpress <john@webxpress.com>
* @version 1.0
*/

class CMSAdminHomeController extends CMSAdminComponent {
  
  public $model = "CmsUser";
	public $model_class;
	public $access = 'administrator';
	public $display_name = "Home";
	public $base_url;
	
	private function process_login() {
		$auth = new CMSAuthorise($this->model);
		if( $auth->verify( $_POST['username'], $_POST['password'] ) === true ){
		  if($_POST['redirect']) return $_POST['redirect'];
			else return 'index';
		}
		else {
		  Session::add_message("Sorry, we can't find that username and password. Try again.");
			return $this->unauthorised_redirect;
		}
	}
				
	public function login() {
		if(count($_POST)>0) $this->redirect_to($this->process_login() );
		Session::set( 'timestamp', time() );
		Session::unset_var('errors');
		$this->use_layout = "login";
		$this->redirect_url = Session::get('referrer');
	}
	
	public function logout( ) {
		$auth = new CMSAuthorise($this->model);
		$auth->logout();
		$this->redirect_to('/');
	}
	
	public function index() {}
	public function support() {}
}
?>