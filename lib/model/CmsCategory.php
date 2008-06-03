<?php

class CmsCategory extends WaxTreeModel {
  
	public $tree_array = array();
	
	public function setup(){
		$this->define("name", "CharField", array('maxlength'=>255) );
		$this->define("url", "CharField", array('maxlength'=>255) );
		$this->define("attached_to", "ManyToManyField", array('target_model'=>"CmsContent"));		
	}
	public function before_save() {
	  $this->url = WXInflections::to_url($this->title);
	}
	 
	public function sections_as_collection($input = false, $padding_char ="&nbsp;&nbsp;") {	
		if(!$this->tree_array && !$input) $this->generate_tree();
		if(!$input) $input = $this->tree_array;
		$collection = array();
		foreach($input as $item){
			$value = str_pad($item->title, strlen($item->title)+ $item->level(), "^", STR_PAD_LEFT);
			$collection["{$item->id}"] = str_replace("^", $padding_char, $value);
		}
		return $collection;
	}
	/*************** OLD FUNCTIONS - TO BE REMOVED - SOME ALREADY RETURN FALSE ********************/	
	protected function traverse_tree($object_array, $order=false, $direction="ASC") {
		return false;
	}
}

?>