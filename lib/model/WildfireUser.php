<?php

class WildfireUser extends WaxModel {
  
  public $role_options = array("0"=>"user", "10"=>"editor", "20"=>"publisher", "30"=>"administrator");
    
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
	/**
	 * this function returns not just the associated sections, but also all sections under those
	 *
	 * @return Iterator with sections
	 * @author Sheldon Els
	 */
	public function allowed_sections_tree(){
	  $sections = new CmsSection();
	  foreach($this->allowed_sections as $section)
	    foreach($section->tree() as $sub_section)
	      $allowed_section_ids[] = $sub_section->primval;
	  return $sections->filter(array("id"=>$allowed_section_ids))->tree();
	}
	
}