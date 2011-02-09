<?php
/**
 * the category model
 * NOTE: big change - this is no longer tree based; never used it as a tree...
 */

class WildfireCategory extends WaxModel {
  /**
   * setup the columns, fields, relationships etc
   */  
	public function setup(){
		$this->define("title", "CharField", array('maxlength'=>255, 'scaffold'=>true) );
		$this->define("url", "CharField", array('maxlength'=>255, 'scaffold'=>true, 'disabled'=>'disabled') );
		$this->define("attached_to", "ManyToManyField", array('target_model'=>"WildfireContent", 'editable'=>false));		
	}
	/**
	 * set the url up
	 */	
	public function before_save() {
	  if(!$this->url) $this->url = Inflections::to_url($this->title);
	}
	
}