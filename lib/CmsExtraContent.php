<?php

class CmsExtraContent extends WXActiveRecord {
  
	public function __get($name) {
	  $model = clone($this);
	  $result = $model->find_by_name($name);
	  if($result) return $result->content;
	  else parent::__get();
	}
}

?>