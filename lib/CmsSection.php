<?php

class CmsSection extends WXTreeRecord {
  
  public $type_options = array("0"=>"Page-Style Content", "1"=>"News Article-Style Content");
	public $tree_array = array();

 	public function section_type() {
 	  return $this->type_options[$this->type];
 	}

	protected function traverse_tree($object_array) {
		foreach($object_array as $node) {
			$this->tree_array[] = $node;
			if($node->has_children()) {
				$this->traverse_tree($node->get_children("title ASC"));
			} 
		}
	}
	
	public function sections_as_collection() {	
		$this->traverse_tree($this->find_roots());
		$collection["0"]="Default";
		foreach($this->tree_array as $item) {
	  	$value = str_pad($item->title, strlen($item->title) + $item->get_level(), "^", STR_PAD_LEFT);
			$value = str_replace("^", "&nbsp;", $value);
			$collection["{$item->id}"] = $value;
		}
		return $collection;
	}
	
	public function find_ordered_sections() {
		$this->traverse_tree($this->find_roots());
		return $this->tree_array();
	}
	
	
 	
	
}

?>