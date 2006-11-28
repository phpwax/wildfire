<?php
/**
* CMS Controller
* @package wxFramework
* @subpackage CMSPlugin
* @author WebXpress <john@webxpress.com>
* @version 1.0
*/

class CMSAdminUserController extends CMSAdminComponent {

	public $model;
	public $model_class = 'CmsUser';
	public $access = 'administrator'; /* set to lowest level, then increase security level in individ method - need to be other way around */ 
	public $display_name = "Users";
	
	public function create() {
		$this->user = new $this->model_class;
		$this->save($this->user);
		$this->form = $this->render_partial("form");
	}
	
	public function edit() {
		$this->accept_routes=1;
		if(!$id = $this->route_array[0]) $this->redirect_to("index");
    $this->user = new $this->model_class($id);
		$this->save($this->user);
		$this->form = $this->render_partial("form");
	}
	
	protected function save($user) {
		if($user->is_posted()) {
      if($user->update_attributes($_POST[$this->model_name]) ) {
        Session::add_message("User Successfully Saved");
        $this->redirect_to('index');
      }
		}
		return false;
	}
	
}
?>