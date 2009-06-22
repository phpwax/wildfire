<?php
/**
 * permissions for modules -> users
 *
 */
class CmsPermission extends WaxModel{
	
	public $operations = array('VIEW'=>'View', 'EDIT'=>'Edit', 'DELETE'=>'Delete');
	
	public function setup(){
	  $this->define("module_name", "CharField", array('maxlength'=>255) );
	  $this->define("user", "ForeignKey", array('target_model'=>'WildfireUser'));	  
	  $this->define("operation", "CharField", array('choices'=>$this->operations, 'widget'=>'SelectInput'));	  	  
	}
		
}

?>
