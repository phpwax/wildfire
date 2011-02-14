<?php
/**
 * admin section for categories - inherits methods from admin component
 */

class CMSAdminCategoryController extends AdminComponent {

  public $module_name = "categories";												
  public $model_class = 'WildfireCategory';
	public $display_name = "Site Categories";
  public $dashboard = false;

}

?>