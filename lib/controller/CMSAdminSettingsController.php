<?php
/**
* Home page controller
* @package PHP-WAX CMS
*/

class CMSAdminSettingsController extends CMSAdminComponent {
	public $module_name = "settings";												
  public $model;
	public $model_name = "cms_configuration";
	public $model_class = "CmsConfiguration";
	public $display_name = "Settings";
	
	public function index() {
	  $this->sub_links = array();
	  $this->handle_post();
	  $this->variable_setup();
	}
	
  
  protected function handle_post() {
    if($_POST['stat_link_url']) CmsConfiguration::set("stat_link_url", $_POST['stat_link_url']);
    if($_POST['stat_search_url']) CmsConfiguration::set("stat_search_url", $_POST['stat_search_url']);
    if($_POST['stat_dash_url']) CmsConfiguration::set("stat_dash_url", $_POST['stat_dash_url']);
		if($_POST['address']) CmsConfiguration::set("address", serialize($_POST['address'])	);
		if($_POST['google_key']) CmsConfiguration::set("google_key", $_POST['google_key']	);
		if($_POST['super_user']) CmsConfiguration::set("super_user", $_POST['super_user']	);
		if($_POST['modules']) CmsConfiguration::set("cms_modules", serialize($_POST['modules']));
  }

  
  
  protected function variable_setup() {
    $this->stat_visit = CmsConfiguration::get("stat_dash_url");
		$this->stat_refer = CmsConfiguration::get("stat_link_url");
		$this->stat_search = CmsConfiguration::get("stat_search_url");
		if($this->address_details = CmsConfiguration::get('address')) {
		  $address_details = unserialize($this->address_details);		
		  $this->postcode = $address_details['postcode']; 
		  $this->name = $address_details['name'];
		  $this->address = $address_details['address']; 
		  $this->email = $address_details['email_address'];
		  $this->phone = $address_details['phone_number'];
		  $this->fax	 = $address_details['fax_number'];
	  }
		$this->google_key = CmsConfiguration::get('google_key');
		$this->super_user = CmsConfiguration::get('super_user');
		$this->all_cms_modules = CmsApplication::get_modules();
		if(!$this->config_modules = unserialize(CmsConfiguration::get("cms_modules"))) $this->config_modules = array(); 
  }



}

?>