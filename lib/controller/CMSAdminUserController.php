<?php
/**
 * controller to handle the users - inherits from admin component
 * @package PHP-WAX CMS
 */

class CMSAdminUserController extends AdminComponent {

  public $module_name = "user";
  public $model_class = 'WildfireUser';
	public $display_name = "Admin Users";
}
?>