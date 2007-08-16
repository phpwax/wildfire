<?php

class CmsExtraContent extends WXActiveRecord {
  
	public function __get($name) {
	  $model = new CmsExtraContent;
	  $result = $model->find_by_name($name);
	  if($result) return $result->content;
	  else parent::__get($name);
	}
}

?>