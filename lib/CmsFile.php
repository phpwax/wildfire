<?php

class CmsFile extends WXFileActiveRecord {
  public function find_all_images() {
	  return $this->find_all(array("conditions"=>"type LIKE '%image%'"));
	}
}

?>