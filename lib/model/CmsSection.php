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
	
	public function tree($node=false){
		if(!$node && $this->root_node->id) $node = $this->root_node;
		elseif(!$node && !$this->root_node->id) $node = $this->get_root();
		$this->tree_array[] = $node;
		$children = $node->children;
		
		if($children && count($children) ){
			foreach($node->children as $child){
				if($newchildren = $child->children) $this->tree($child);
				else $this->tree_array[] = $child;
			}
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
		$stack = array();
		if(!$this->root_node->id) $this->get_root();
		//if this is the root section, return this url
		if($this->id == $this->root_node->id) return "/".$this->url;
		//otherwise loop up the parent cols
		else{
			$url = "/";
			$path = array_reverse($this->path_to_root());
			foreach($path as $object) if($object->url != "home") $url .= $object->url."/";
			return substr($url, 0, -1);
		}
		return "";
	}	
	/* changed how this works...parent section is now longer used */
	public function find_ordered_sections() {
		if(!$this->tree_array) $this->tree();
		return $this->tree_array;
	}
	/*************** OLD FUNCTIONS - TO BE REMOVED - SOME ALREADY RETURN FALSE ********************/
	protected function traverse_tree($object_array, $order=false, $direction="ASC") {
		return false;
	}
	/* shouldnt be in use - returns false */
	public function template_style() {
		return false;
 	}
	
	/* not used any more -- returns empty array */
	public function filtered_sections($id, $params=array()) {
		return array();
	}
	/* dont think this is needed any more - leave it in for now, should be done by the field? */
	public function prevent_orphans($information, $value){
		return false;
	}
	/*** err - this subscriber stuff has been removed... ***/
	public function get_subscribers($handle){
		return false;
	}
	
	public function get_subscribe_info($handle){
		return false;
	}

}

?>