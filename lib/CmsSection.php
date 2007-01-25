<?php

class CmsSection extends WXTreeRecord {
  
  public $type_options = array("0"=>"Page Template", "1"=>"News Template");
	public $tree_array = array();

	public function template_style() {
 	  return $this->type_options[$this->section_type];
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
		if(!$this->tree_array) $this->traverse_tree($this->find_roots());
		$collection["0"]="Default";
		foreach($this->tree_array as $item) {
	  	$value = str_pad($item->title, strlen($item->title) + $item->get_level(), "^", STR_PAD_LEFT);
			$value = str_replace("^", "&nbsp;", $value);
			$collection["{$item->id}"] = $value;
		}
		return $collection;
	}
	
	public function find_ordered_sections() {
		if(!$this->tree_array) $this->traverse_tree($this->find_roots());
		return $this->tree_array;
	}
	
	public function filtered_sections($id) {
		if(!$this->tree_array) $this->traverse_tree($this->find_roots());
		$array = $this->tree_array;
		foreach($array as $key=>$node) {
			if($node->section_type != $id) unset($array[$key]);
		}
		return $array;
	} 	
	
}

?>