<?php

class CmsSection extends WXActiveRecord {
  
  public $type_options = array("0"=>"Page-Style Content", "1"=>"News Article-Style Content");
 	
 	public function after_setup() {
 	  $this->has_many("cms_file", "images");
 	}

 	public function section_type() {
 	  return $this->type_options[$this->type];
 	}
 	
	
}

?>