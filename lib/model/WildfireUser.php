<?php

class WildfireUser extends WaxModel {

  public $identifier = "username";
  public static $permissions_cache = false;
  public $enable_permissions = true;
  public static $salt = "wildfire";

  public function setup() {
    $this->define("username", "CharField", array("required"=>true, 'export'=>true, "blank"=>false,"unique"=>true, 'scaffold'=>true));
    $this->define("firstname", "CharField", array('scaffold'=>true, 'export'=>true));
    $this->define("surname", "CharField",array('scaffold'=>true, 'export'=>true));
    $this->define("email", "CharField", array('scaffold'=>true, 'export'=>true));
    $this->define("password", "PasswordField", array('label'=>'Enter your password', 'group'=>'password'));
    $this->define("auth_token", "CharField", array('disabled'=>'disabled', 'group'=>'token auth'));
    $this->define("user_permissions", "HasManyField", array('editable'=>true,'target_model' => 'WildfirePermissionBlacklist', 'eager_loading' => true, 'group'=>'permissions'));
    parent::setup();
  }

  public function before_save(){
    if(!$this->primval) $this->password = md5($this->password);
    if(!$this->auth_token) $this->auth_token = hash_hmac("sha1", $this->username, WildfireUser::$salt);
  }

  protected function set_permissions_cache(){
    if(!WildfireUser::$permissions_cache[get_class($this)][$this->primval]){
      WildfireUser::$permissions_cache[get_class($this)][$this->primval] = array('true'=>true); //set to true, empty array triggers false
      foreach($this->user_permissions as $perm) WildfireUser::$permissions_cache[get_class($this)][$this->primval][$perm->class][$perm->operation] = ($perm->value === NULL) ? 1 : $perm->value;
    }
  }

  public function allowed($classname=false,$action=false){
    if(!$this->primval) return false;
    $this->set_permissions_cache();
    if(WildfireUser::$permissions_cache[get_class($this)][$this->primval][$classname][$action]) return false;
    return true;
  }

  public function restricted_tree($classname){
    if(!$this->primval()) return false;
    $this->set_permissions_cache();
    if($val = WildfireUser::$permissions_cache[get_class($this)][$this->primval()][$classname]["tree"]) return explode(":", $val);
  }

  public function permissions($operation_actions, $module_name){
    $permissions = array();
    foreach($operation_actions as $oa) if($this->allowed($module_name, $oa)) $permissions[$oa] = 1;
    return $permissions;
  }

}
