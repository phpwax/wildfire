<?php

class CmsFile extends WXFileActiveRecord {
  public function find_all_images() {
	  return $this->find_all(array("conditions"=>"type LIKE '%image%'"));
	}
	
	public function find_filter_images($filter) {
	  return $this->find_all(array("conditions"=>"type LIKE '%image%' AND filename LIKE '%$filter%'"));
	}
	
	
	
	
}

?>