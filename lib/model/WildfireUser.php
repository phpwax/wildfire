<?php

class WildfireUser extends WaxModel {
  
  public $identifier = "fullname";
  public $permissions_cache = false;
    
  public function setup() {
    $this->define("username", "CharField", array("required"=>true, "blank"=>false,"unique"=>true, 'default'=>'Enter Username Here'));
    $this->define("firstname", "CharField");
    $this->define("surname", "CharField");
    $this->define("email", "CharField");
    $this->define("password", "CharField");
    
    $this->define("allowed_sections", "ManyToManyField", array('target_model' => 'CmsSection'));
    $this->define("permissions", "HasManyField", array('target_model' => 'CmsPermission', 'join_order' => 'class', 'join_field' => 'wildfire_user_id', 'eager_loading' => true));
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
	
	public function fetch_permissions(){
	  foreach($this->permissions as $permission){
	    $this->permissions_cache[$permission->class][$permission->operation] = $permission->allowed;
	  }
	}
  
	public function access($class, $operation){
	  return $this->permissions_cache[$class][$operation];
	}
	
}
