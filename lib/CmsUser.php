<?php

class CmsUser extends WXActiveRecord {
  
  public $role_options = array("0"=>"user", "10"=>"editor", "20"=>"publisher", "30"=>"administrator");
  
	function validations() {
		$this->valid_required("username");
		$this->valid_required("password");
		$this->valid_unique("username");
	}
	
	public function role_text() {
	  return $this->role_options[$this->usergroup];
	}
	
	public function fullname() {
	  return $this->firstname." ".$this->surname;
	}
	
	
}

?>