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
  public $display_name = "Dashboard";
  public $model_scope = "live";
  public $model_search_scope = "live";

  public $visit_data = array();
  public $sources_data = array();
  public $search_data = array();
  public $has_help = array('index');
  public static $dashboards = array();
  public $show_analytics = true;

  public function events(){
    parent::events();
    WaxEvent::clear("cms.layout.sublinks");
  }


  public function _analytics(){
    $analytics = Config::get("analytics");
    $api = new GoogleAnalytics();
    if($this->use_format == "ajax" && ($login = $api->login($analytics['email'], $analytics['password']))){
      $api->load_accounts();
      $this->visit_data = $api->data($analytics['id'], 'ga:day,ga:date', 'ga:visits', "-ga:date",false,false,($analytics['days'])?$analytics['days']:30);
      $this->sources_data = $api->data($analytics['id'], 'ga:source,ga:referralPath', 'ga:visits', false,false,false,($analytics['days'])?$analytics['days']:30);
      $this->search_data = $api->data($analytics['id'], 'ga:keyword', 'ga:visits', false,false,false,($analytics['days'])?$analytics['days']:30);
      $this->browser_data = $api->data($analytics['id'], 'ga:browser', 'ga:visits', false,false,false,($analytics['days'])?$analytics['days']:30);
      $this->mobile_data = $api->data($analytics['id'], 'ga:isMobile', 'ga:visits', false,false,false,($analytics['days'])?$analytics['days']:30);
      array_shift($this->search_data);
    }
  }

  public function edit(){
    $this->redirect_to("/admin/content/edit/".Request::param("id")."/");
  }


}
?>