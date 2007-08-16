<?php

class CmsExtraContent extends WXActiveRecord {
  
	public function __get($name) {
	  self::check_extra($name);
	  parent::__get($name);
	}
	
	static public function check_extra($name) {
	  
	}
}

?>