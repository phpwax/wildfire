<?php

class CmsCategory extends WXTreeRecord {
  
	public $tree_array = array();

	protected function traverse_tree($object_array, $order=false, $direction="ASC") {
		foreach($object_array as $node) {
			$this->tree_array[] = $node;
			if($node->has_children()) {
			  if($order) $this->traverse_tree($node->get_children("`".$order."` ".$direction));
				else $this->traverse_tree($node->get_children());
			} 
		}
	}
	
	public function categories_as_collection($input = null, $default_array = array('0'=>'')) {	
		if(!$this->tree_array) $this->traverse_tree($this->find_roots());
		if(!$input) $input = $this->tree_array;
		$collection = $default_array;
		foreach($input as $item) {
	  	$value = str_pad($item->name, strlen($item->name) + $item->get_level(), "^", STR_PAD_LEFT);
			$value = str_replace("^", "&nbsp;", $value);
			$collection["{$item->id}"] = $value;
		}
		return $collection;
	}	
	
	
}

?>