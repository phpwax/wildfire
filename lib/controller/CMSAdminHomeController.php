<?php
/**
* Home page controller
* @package PHP-WAX CMS
*/

class CMSAdminHomeController extends AdminComponent {
	public $module_name = "home";												
  public $model;
	public $model_name = "wildfire_user";
	public $model_class = "WildfireUser";
	public $display_name = "Dashboard";

}
