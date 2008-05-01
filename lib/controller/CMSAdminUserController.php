<?php

class CMSAdminUserController extends CMSAdminComponent {

  public $module_name = "users";												
  public $model_class = 'WildfireUser';
	public $model_name = "wildfire_user";													
	public $display_name = "CMS Users";
	public $scaffold_columns = array(
    "username"   =>array(),
		"email" =>  array(),
		"firstname" =>  array(),
		"surname" =>  array()
  );
  public $filter_columns = array("username", "email");
	public $order_by_columns = array("username","email");

	

}

?>