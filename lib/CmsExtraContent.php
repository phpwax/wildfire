<?php

class CmsExtraContent extends WXActiveRecord {
  
	public function __get($name) {
	  self::check_extra($name);
	  parent::__get($name);
	}
	
	public function check_extra($name) {
	  if(!$this->id) return false;
	  $sql = "SELECT value FROM cms_extra_content WHERE cms_content_id = ".$this->id." AND `name` = $name";
	  die($sql);
	}
}

?>