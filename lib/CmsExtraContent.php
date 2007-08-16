<?php

class CmsExtraContent extends WXActiveRecord {
  
	public function __get($name) {
	  $this->check_extra($name);
	  parent::__get($name);
	}
	
	public function check_extra($name) {
	  $model = new CmsExtraContent;
	  $result = $model->find_all_by_name($name);
	  if($result) {print_r($result); exit;}
	}
}

?>