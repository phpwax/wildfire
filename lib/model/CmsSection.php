<?php

class CmsSection extends WaxTreeModel {
	
	public $order_field = "order";
	public $order_direction = "ASC";
	public $tree_array = false;
	
	public function setup(){
		$this->define("title", "CharField", array('maxlength'=>255) );
		$this->define("introduction", "TextField");
		$this->define("order", "IntegerField", array('maxlength'=>5) );
		$this->define("url", "CharField", array('maxlength'=>255) );
	}
	
	public function tree($nodes = false){
    if($this->tree_array && !$nodes) return $this->tree_array;
    if(!$nodes) $nodes = $this->roots;
    foreach($nodes as $node){
      $this->tree_array[] = $node;
      $this->tree($node->children);
    }
    return $this->tree_array;
	}
	
	public function before_save() {
		$this->url = WXInflections::to_url($this->title);
	}	
	
	public function sections_as_collection($input=false,$padding_char ="&nbsp;&nbsp;") {
		if(!$input) $input = $this->tree();
		$collection = array();
		foreach($input as $item){
			$value = str_pad($item->title, strlen($item->title) + $item->get_level()+1, "^", STR_PAD_LEFT);
			$collection["{$item->id}"] = str_replace("^", $padding_char, $value);
		}
		return $collection;
	}
	
	public function permalink() {
	  print_r($this->path_to_root());
		$path = array_reverse($this->path_to_root());
		print_r($path); exit;
		foreach($path as $object)
		  $url .= "/".$object->url;
		  $url = str_replace("/home", "", $url);
		return $url;
	}	
	/* changed how this works...parent section is now longer used */
	public function find_ordered_sections() {
		if(!$this->tree_array) $this->tree_array = $this->tree();
		return $this->tree_array;
	}


}

?>