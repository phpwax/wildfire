<?php
class CmsPermission extends WaxPermission{
  
	public function setup(){
	  parent::setup();
    $this->define("user", "ForeignKey", array('target_model' => 'WildfireUser'));
	}
		
}

?>
