<?php

class CampaignContent extends WaxModel {
	
 
	
	public function setup(){
		$this->define("title", "CharField", array('maxlength'=>255, 'editable'=>false, 'required'=>true) );				
		$this->define("subject", "CharField", array('maxlength'=>255, 'editable'=>false, 'required'=>true) );		
		$this->define("content", "TextField");
		$this->define("date_created", "DateTimeField", array("editable"=>false));
		$this->define("images", "ManyToManyField", array('target_model'=>"WildfireFile", 'editable'=>false, "eager_loading"=>true));
		$this->define("url", "CharField");		
  }


	public function before_save(){
		$this->url = WXInflections::to_url($this->subject);
		$this->date_created = date("Y-m-d H:i:s");
	}
}

?>
