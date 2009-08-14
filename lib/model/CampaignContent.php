<?php

class CampaignContent extends WaxModel {
	
 
	
	public function setup(){
		$this->define("title", "CharField", array('maxlength'=>255, 'editable'=>false) );				
		$this->define("subject", "CharField", array('maxlength'=>255, 'editable'=>false) );		
		$this->define("content", "TextField");
		$this->define("date_created", "DateTimeField", array("editable"=>false));
		$this->define("articles", "ManyToManyField", array('target_model'=>"CmsContent", 'editable'=>false, "eager_loading"=>true));
		$this->define("url", "CharField");		
  }


	public function before_save(){
		$this->url = Inflections::to_url($this->subject);
		$this->date_created = date("Y-m-d H:i:s");
	}
}

?>
