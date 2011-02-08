<?php

class WildfireUser extends WaxModel {

  public $identifier = "username";
  public $permissions_cache = false;
  public $enable_permissions = true;

  public function setup() {
    $this->define("username", "CharField", array("required"=>true, "blank"=>false,"unique"=>true, 'default'=>'Enter Username Here'));
    $this->define("firstname", "CharField");
    $this->define("surname", "CharField");
    $this->define("email", "CharField");
    $this->define("password", "PasswordField");

    $this->define("permissions", "HasManyField", array('target_model' => 'WildfirePermissionBlacklist', 'eager_loading' => true));
  }

  public function before_save(){
    if(!$this->primval) $this->password = md5($this->password);
  }

	public function allowed($classname=false,$action=false){
	  $data = $this->permissions;
	  if($classname) $data->filter("class", $classname);
	  if($action) $data->filter("operation", $action);
    if($data->all()->count()) return false;
    else return true;
	}


}
