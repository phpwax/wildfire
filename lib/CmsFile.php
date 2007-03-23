<?php

class CmsFile extends WXFileActiveRecord {
  public function find_all_images() {
	  return $this->find_all(array("conditions"=>"type LIKE '%image%'"));
	}
	
	public function find_filter_images($filter, $limit = false) {
    $params = array("conditions"=>"type LIKE '%image%' AND (filename LIKE '%$filter%' OR caption LIKE '%$filter%')");
    if($limit) $params['limit']=$limit;
	  return $this->find_all($params);
	}
	
	
	
	
}

?>