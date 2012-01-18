<?php
/**
 * the category model
 * NOTE: big change - this is no longer tree based; never used it as a tree...
 */

class WildfireCategory extends WaxModel {
  public $identifier = "title";
  /**
   * setup the columns, fields, relationships etc
   */  
	public function setup(){
		$this->define("title", "CharField", array('export'=>true, 'maxlength'=>255, 'scaffold'=>true) );
		$this->define("url", "CharField", array('export'=>true, 'maxlength'=>255, 'scaffold'=>true, 'disabled'=>'disabled') );
		$this->define("content", "ManyToManyField", array('target_model'=>"WildfireContent", 'editable'=>false));		
    $this->define("media", "ManyToManyField", array('target_model'=>"WildfireMedia", 'editable'=>false));
	}
	/**
	 * set the url up
	 */	
	public function before_save() {
    $this->url = Inflections::to_url($this->title);
	}
	
	public function scope_multipleselect(){
	  return $this->order("title ASC");
	}
}