<?php
/**
 * controller to handle the users - inherits from admin component
 * @package PHP-WAX CMS
 */

class CMSAdminUserController extends AdminComponent {

  public $module_name = "users";
  public $model_class = 'WildfireUser';
	public $display_name = "Admin Users";
	public $dashboard = false;
	
	protected function events(){
	  parent::events();
	  //overwrite existing events - handle the revision change
	  WaxEvent::add("cms.save.before", function(){
	    $obj = WaxEvent::data();;
	    if($pwd = Request::param('new_password')) $obj->model = $obj->model->update_attributes(array('password'=>md5($pwd)));
    });
  }
}
?>