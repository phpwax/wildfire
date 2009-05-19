<?php
/**
 * the category model
 * NOTE: big change - this is no longer tree based; never used it as a tree...
 */

class CmsCategory extends WaxModel {
  /**
   * setup the columns, fields, relationships etc
   */  
	public function setup(){
		$this->define("name", "CharField", array('maxlength'=>255) );
		$this->define("url", "CharField", array('maxlength'=>255) );
		$this->define("attached_to", "ManyToManyField", array('target_model'=>"CmsContent"));		
	}
	/**
	 * set the url up
	 */	
	public function before_save() {
	  $this->url = WXInflections::to_url($this->name);
	}
	/**
	 * create an array structure from drop downs used elsewhere
	 */	
	public function sections_as_collection() {	
		$model = new CmsCategory;
		$collection = array();
		foreach($model->all() as $item) $collection["{$item->id}"] = $item->title;
		return $collection;
	}
	
	/*************** OLD FUNCTIONS - TO BE REMOVED - ALREADY RETURN FALSE (see, we can be nice too - no fatal errors) ********************/	
	protected function traverse_tree($object_array, $order=false, $direction="ASC") {
		return false;
	}
	//no longer a tree structure
	public function tree_collection() {
	  return false;
	}
}

?>