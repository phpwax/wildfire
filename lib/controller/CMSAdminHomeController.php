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
	
	public function events(){
	  parent::events();
	  WaxEvent::clear("cms.layout.sublinks");
	  WaxEvent::add("cms.layout.sublinks", function(){
      $obj = WaxEvent::$data;
      $obj->quick_links = array("create new content"=>'/admin/content/create/', 'manage files'=>"/admin/files/");
    });
	}

}
