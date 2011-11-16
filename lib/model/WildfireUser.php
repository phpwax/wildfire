<?php

class WildfireUser extends WaxModel {

  public $identifier = "username";
  public static $permissions_cache = false;
  public $enable_permissions = true;

  public function setup() {
    $this->define("username", "CharField", array("required"=>true, 'export'=>true, "blank"=>false,"unique"=>true, 'scaffold'=>true));
    $this->define("firstname", "CharField", array('scaffold'=>true, 'export'=>true));
    $this->define("surname", "CharField",array('scaffold'=>true, 'export'=>true));
    $this->define("email", "CharField", array('scaffold'=>true, 'export'=>true));
    $this->define("password", "PasswordField", array('label'=>'Enter your password', 'group'=>'password'));

    $this->define("permissions", "HasManyField", array('target_model' => 'WildfirePermissionBlacklist', 'eager_loading' => true, 'group'=>'permissions'));
  }

  public function before_save(){
    if(!$this->primval) $this->password = md5($this->password);
  }

  public function allowed($classname=false,$action=false){
    if(!$this->primval()) return false;
    if(!self::$permissions_cache) self::$permissions_cache[get_class($this)][$this->primval()] = $this->permissions;
    foreach(self::$permissions_cache[get_class($this)][$this->primval()] as $perm) if($perm->class == $classname && $perm->operation = $action) return false;
    return true;
  }

  public function permissions($operation_actions, $module_name){
    $permissions = array();
    foreach($operation_actions as $oa) $permissions[$oa] = $this->allowed($module_name, $oa);
    return $permissions;
  }
  
}
