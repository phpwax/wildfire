<?php

class WildfireUser extends WaxModel {
  
<<<<<<< HEAD:lib/model/WildfireUser.php
  public $role_options = array("0"=>"user", "10"=>"editor", "20"=>"publisher", "30"=>"administrator");
  public $identifier = "fullname";
=======
  public $role_options = array("10"=>"content editor", "20"=>"site administrator", "30"=>"root");
>>>>>>> ea429046c3c5e5a99e862bd88a72f364cb581c6a:lib/model/WildfireUser.php
    
  public function setup() {
    $this->define("username", "CharField", array("required"=>true, "unique"=>true));
    $this->define("firstname", "CharField");
    $this->define("surname", "CharField");
    $this->define("email", "CharField");
    $this->define("password", "CharField", array("required"=>true));
    $this->define("usergroup", "CharField");
    $this->define("allowed_sections", "ManyToManyField", array('target_model' => 'CmsSection'));
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
}