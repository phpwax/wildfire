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
	  $this->stat_setup();
	}
	
  
  protected function stat_setup() {
    if($_POST['stat_link_url']) CmsConfiguration::set("stat_link_url", $_POST['stat_link_url']);
    if($_POST['stat_search_url']) CmsConfiguration::set("stat_search_url", $_POST['stat_search_url']);
    if($_POST['stat_dash_url']) CmsConfiguration::set("stat_dash_url", $_POST['stat_dash_url']);
		if($_POST['address']) CmsConfiguration::set("address", serialize($_POST['address'])	);
		if($_POST['google_key']) CmsConfiguration::set("google_key", $_POST['google_key']	);
		$this->stat_visit = CmsConfiguration::get("stat_dash_url");
		$this->stat_refer = CmsConfiguration::get("stat_link_url");
		$this->stat_search = CmsConfiguration::get("stat_search_url");
  }

  
  
  protected function address_setup() {
		$this->address_details = CmsConfiguration::get('address');
		$address_details = unserialize($this->address_details);		
		$this->postcode = $address_details['postcode']; 
		$this->name = $address_details['name'];
		$this->address = $address_details['address']; 
		$this->email = $address_details['email_address'];
		$this->phone = $address_details['phone_number'];
		$this->fax	 = $address_details['fax_number'];
		$this->google_key = CmsConfiguration::get('google_key');
  }



}

?>