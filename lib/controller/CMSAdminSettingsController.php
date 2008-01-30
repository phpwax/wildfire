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
	public $sub_links = array("index"=>"General");
	public $admin_options = array("modules");
	public $default_options = array();
	
	public function controller_global() {
	  unset($this->sub_links["create"]);
	  $this->type= $this->action;
	  if($this->type=="index") $this->type="general";
	  $this->action = "edit";
	  $this->all_cms_modules = CmsApplication::get_modules();
	  $section = new CmsSection;
		$this->all_cms_sections = $section->find_all();
	  $this->handle_post();
	  $this->variable_setup();
	}
	
	public function edit() {
	  $this->use_view=$this->type;
	}
	
	
  
  protected function handle_post() {
		foreach($_POST as $setting=>$vals) {
		  CmsConfiguration::set($setting, serialize($vals));
		}
  }
  
  
  protected function variable_setup() {
    $this->{$this->type} = CmsConfiguration::get($this->type); 
  }

  protected function options_setup() {
    foreach($this->default_options as $option) {
      $this->sub_links[$option]=humanize($options);
    }
    if($this->is_admin) {
      foreach($this->admin_options as $option) {
        $this->sub_links[$option]=humanize($options);
      }
    }
  }


}

?>