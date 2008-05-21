<?php

class CmsExtraContent extends WaxModel {
  
	public function setup(){
		$this->define("name", "CharField", array('maxlength'=>255) );
		$this->define("extra_content", "TextField");
		$this->define("content", "ForeignKey", array('model_name'=>'CmsContent', 'col_name'=>"cms_content_id"));
		
	}
	
}

?>