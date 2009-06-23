<?php
/**
 * permissions for modules -> users
 *
 */
class CmsPermission extends WaxModel{
	
	public static $operations = array('CREATE', 'VIEW', 'EDIT', 'DELETE', 'ADMIN');
	
	public function setup(){
	  $this->define("module", "CharField", array('maxlength'=>255) );
	  $this->define("operation", "IntegerField", array('choices'=>self::$operations, 'maxlength'=>3) );	  
    $this->define("users", "ManyToManyField", array('target_model' => 'WildfireUser', 'join_model_class'=>"WaxModelPermissionsJoin", 'eager_loading'=>true));
	}
		
	public function operation(){
	  return self::$operations[$this->operation];
	}
	
}

?>
