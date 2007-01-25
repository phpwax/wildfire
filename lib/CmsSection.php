<?php

class CmsSection extends WXTreeRecord {
  
  public $type_options = array("0"=>"Page-Style Content", "1"=>"News Article-Style Content");

 	public function section_type() {
 	  return $this->type_options[$this->type];
 	}
 	
	
}

?>