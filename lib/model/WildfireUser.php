<?php

class WildfireUser extends WaxModel {
  
  public $role_options = array("0"=>"user", "10"=>"editor", "20"=>"publisher", "30"=>"administrator");
  public $identifier = "fullname";
    
  public function setup() {
    $this->define("username", "CharField", array("required"=>true, "unique"=>true));
    $this->define("firstname", "CharField");
    $this->define("surname", "CharField");
    $this->define("email", "CharField");
    $this->define("password", "CharField", array("required"=>true));
    $this->define("usergroup", "CharField");
    $this->define("allowed_sections", "ManyToManyField", array('target_model' => 'CmsSection'));
    $this->define("permissions", "HasManyField", array('target_model' => 'CmsPermission'));    
  }

	
	public function role_text() {
	  return $this->role_options[$this->usergroup];
	}
	
	public function fullname() {
	  return $this->firstname." ".$this->surname;
	}
	
	public function articles() {
	  $content = new CmsContent("published");
	  return $content->filter(array("author_id"=>$this->id))->all();
	}

	public function allowed_sections_ids(){
	  $allowed_section_ids = array();
	  foreach($this->allowed_sections as $section)
	    foreach($section->tree() as $sub_section)
	      $allowed_section_ids[] = $sub_section->primval;
  	return $allowed_section_ids;
	}
	
	public function allowed_sections_model(){
	  $sections = new CmsSection();
		if($ids = $this->allowed_sections_ids()) $sections->filter(array("id"=>$ids));
  	return $sections;
	}
	
	public function access($module_name, $operation){
    $data = $this->permissions(array("module_name"=>$module_name, 'operation'=>$operation));	  
	  if($this->permissions && $this->permissions->count() && $data->count()) return true;
	  elseif($this->permissions && $this->permissions->count()) return false;
	  else return true;
	}
}
