<?php

class CmsSection extends WXTreeRecord {
  
  public $type_options = array("0"=>"Page Template", "1"=>"News Template");
	public $tree_array = array();
	public $order_field = "order";
	public $order_direction = "ASC";
	static public $default_section_id = "1";
	
	public function before_save() {
		$this->url = WXInflections::to_url($this->title);
	}

	public function template_style() {
 	  return $this->type_options[$this->section_type];
 	}

	
	protected function traverse_tree($object_array, $order=false, $direction="ASC") {
		foreach($object_array as $node) {
			$this->tree_array[] = $node;
			if($node->has_children()) {
			  if($order) $this->traverse_tree($node->get_children("`".$order."` ".$direction));
				else $this->traverse_tree($node->get_children());
			} 
		}
	}
	
	public function sections_as_collection($input = null) {	
		if(!$this->tree_array) $this->traverse_tree($this->find_roots());
		if(!$input) $input = $this->tree_array;
		foreach($input as $item) {
	  	$value = str_pad($item->title, strlen($item->title) + $item->get_level(), "^", STR_PAD_LEFT);
			$value = str_replace("^", "&nbsp;", $value);
			$collection["{$item->id}"] = $value;
		}
		return $collection;
	}
	
	public function find_ordered_sections($start_level = "0") {
    $this->tree_array=array();
		$this->traverse_tree($this->find_roots($start_level), $this->order_field, $this->order_direction);
		return $this->tree_array;
	}
	
	public function filtered_sections($id, $params=array()) {
		if(!$this->tree_array) $this->traverse_tree($this->find_roots());
		$array = $this->tree_array;
		foreach($array as $key=>$node) {
			if($node->section_type != $id) unset($array[$key]);
		}
		return $array;
	}
	
	public function permalink() {
	  $stack = array();
	  if($this->id != self::$default_section_id) $stack[]=$this->url;
	  $section = $this;
	  while($section = $section->parent()) {
	    if($section->id != self::$default_section_id) $stack[]=$section->url;
	  }
	  if(count($stack)) {
	    $stack = array_reverse($stack);
  	  return "/".implode("/", $stack);
	  }
	  return "";
	}
	
}

?>