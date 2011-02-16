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
	
	public $visit_data = array();
	
	public function events(){
	  parent::events();
	  WaxEvent::clear("cms.layout.sublinks");
	  WaxEvent::add("cms.layout.sublinks", function(){
      $obj = WaxEvent::$data;
      $obj->quick_links = array("create new content"=>'/admin/content/create/', 'manage files'=>"/admin/files/");
    });
	}
	
	
	public function _dashboard(){
	  $analytics = Config::get("analytics");
	  $api = new GoogleAnalytics();
	  if($this->use_format == "ajax" && ($login = $api->login($analytics['email'], $analytics['password']))){
	    $api->load_accounts();
    	$this->visit_data = $api->data($analytics['id'], 'ga:day,ga:date', 'ga:visits', "-ga:date",false,false,($analytics['days'])?$analytics['days']:7);
    	$this->sources_data = $api->data($analytics['id'], 'ga:source,ga:referralPath', 'ga:visits');
    	$this->search_data = $api->data($analytics['id'], 'ga:keyword', 'ga:visits');
    	array_shift($this->search_data);
	  }
	}

}
