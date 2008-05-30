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

	protected function traverse_tree($object_array, $order=false, $direction="ASC") {
		if(!$order) $order = $this->primary_key;
		foreach($object_array as $node){
			$this->tree_array[] = $node;
			if($node->children && $node->children->count())	$this->traverse_tree($node->children->order($order . " ". $direction)->all());
		}
	}
	
	public function sections_as_collection($input = null, $padding_char ="&nbsp;&nbsp;") {	
		if(!$this->tree_array && !$input){
			$this->traverse_tree(array($this->root));
			$input = $this->tree_array;
		}
		$collection = array();
		foreach($input as $item){
			$value = str_pad($item->title, strlen($item->title)+ $item->get_level(), "^", STR_PAD_LEFT);
			$collection["{$item->id}"] = str_replace("^", $padding_char, $value);
		}
		return $collection;
	}
		
	
}

?>