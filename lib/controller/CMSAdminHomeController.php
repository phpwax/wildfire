<?php
/**
* Home page controller
* @package PHP-WAX CMS
*/

class CMSAdminHomeController extends AdminComponent {
	public $module_name = "home";												
  public $model;
	public $model_name = "wildfire_content";
	public $model_class = "WildfireContent";
	public $search_class = "WildfireContent";
	public $display_name = "Dashboard";
	
	public $visit_data = array();
	public $sources_data = array();
	public $search_data = array();
	
	public function events(){
	  parent::events();
	  WaxEvent::clear("cms.layout.sublinks");
	  WaxEvent::add("cms.layout.sublinks", function(){
      $obj = WaxEvent::data();
      $obj->quick_links = array("new"=>'/admin/content/create/');
    });
    WaxEvent::add("cms.search.".$this->module_name, function(){
      $obj = WaxEvent::data();
      if($search = Request::param('term')){
        $obj->search_term = $search;
        $model = new $obj->search_class;
        $obj->search_results = $model->filter("title LIKE '$search%'")->limit(5)->all();
      }
      
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

  public function search(){       
    WaxEvent::run("cms.search.".$this->module_name, $this);
  }

}
