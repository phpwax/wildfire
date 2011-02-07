<?php

class WildfireUser extends WaxModel {
  
  public $identifier = "fullname";
  public $permissions_cache = false;
  public $enable_permissions = true;
    
  public function setup() {
    $this->define("username", "CharField", array("required"=>true, "blank"=>false,"unique"=>true, 'default'=>'Enter Username Here'));
    $this->define("firstname", "CharField");
    $this->define("surname", "CharField");
    $this->define("email", "CharField");
    $this->define("password", "PasswordField");
    
    $this->define("permissions", "HasManyField", array('target_model' => 'WildfirePermission', 'join_order' => 'class', 'join_field' => 'wildfire_user_id', 'eager_loading' => true));
  }

  public function before_save(){
    if(!$this->primval) $this->password = md5($this->password);
  }
	
	
}
