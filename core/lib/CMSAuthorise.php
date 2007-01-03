<?php
/**
* CMSAuthorise extends DbAuthorise
* @package wxFramework
* @subpackage CMSPlugin
* @author WebXpress <john@webxpress.com>
* @version 1.0
*/
require_once('wax/Authorise.php');
class CMSAuthorise extends DBAuthorise {

	public $database_table = "CmsUser";


  public function __construct($table) {
    $this->database_table = $table;
    parent::__construct();
  }
  
/**
* Returns cmsuser if authorised - false on fail
* @return mixed userObj or false on fail
*/	
	public function get_user() {
		if($this->user_object) {
			return $this->user_object;
		}
		return false;
	}
		
}
?>