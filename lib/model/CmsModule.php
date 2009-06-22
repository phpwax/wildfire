<?php
/**
 * permissions for modules -> users
 *
 */
class CmsModule extends WaxModel{
	
	public static $operations = array('CREATE'=> 'Create', 'VIEW'=>'View', 'EDIT'=>'Edit', 'DELETE'=>'Delete', 'ADMIN'=>'Admin');
	
	public function setup(){
	  $this->define("name", "CharField", array('maxlength'=>255) );
    $this->define("users", "ManyToManyField", array('target_model' => 'WildfireUser', 'join_model_class'=>"WaxModelPermissionsJoin", 'eager_loading'=>true));    	  
	}
		
}

?>
