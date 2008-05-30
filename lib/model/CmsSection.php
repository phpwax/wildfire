<?php

class CmsSection extends WaxTreeModel {
	
	public $tree_array = array();
	public $order_field = "order";
	public $order_direction = "ASC";
	
	public function setup(){
		$this->define("title", "CharField", array('maxlength'=>255) );
		$this->define("introduction", "TextField");
		$this->define("order", "IntegerField", array('maxlength'=>5) );
		$this->define("url", "CharField", array('maxlength'=>255) );
	}
	
	public function before_save() {
		$this->url = WXInflections::to_url($this->title);
	}
	
	protected function traverse_tree($object_array, $order=false, $direction="ASC") {
		if(!is_array($object_array)) $object_array = array($object_array);
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
	
	public function permalink() {
		$stack = array();
		$root_id = $this->root->id;
		//if this is the root section, return this url
		if($this->id == $root_id) return "/".$this->url;
		//otherwise loop up the parent cols
		else{
			$url = "/";
			$path = array_reverse($this->array_to_root());
			foreach($path as $object) if($object->url != "home") $url .= $object->url."/";
			return substr($url, 0, -1);
		}
		return "";
	}	
	/* changed how this works... now pass in the parent section you want to to start at */
	public function find_ordered_sections($parent_section = false) {
		$this->tree_array = array();
		if(!$parent_section) $data = array($this->root());
		else $data = $parent_section->children;
		$this->traverse_tree($data);
		return $this->tree_array;
	}
	/*************** OLD FUNCTIONS - TO BE REMOVED - SOME ALREADY RETURN FALSE ********************/
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
		/*if(!is_array($information) || !$value || $value == 1) return false;
		$sql = 'UPDATE `' . $information['table'] .'` SET `'.$information['field']."` = '".$information['new_parent_id']."' WHERE `".$information['field']."` = $value";
		$this->pdo->exec($sql);*/
		return false;
	}
	/*** err - this subscriber stuff needs re writing... ***/
	public function get_subscribers($handle){
		switch($handle){
			default:
			$params = array('conditions'=>"status=1 AND handle='$handle'");
		}
		$model = new CmsSubscriber();
		$results = $model->find_all($params);
		return $results;
	}
	
	public function get_subscribe_info($handle){
		
		switch($handle){			
			default:
				$params = array('conditions'=>"status=1", 'limit'=>4, 'order'=>"published", 'direction'=>"DESC");
				
		}		
		$content = new CmsContent();
		$results = $content->find_all($params);
		$parsed_results = array();
		foreach($results as $result){
			$parsed_results[] = strip_tags(preg_replace(array("/<p[^>]*>/iU","/<\/p[^>]*>/iU"),
	                        array("\n\n"),
	                        $result->content));
		}
		$parsed_results['title'] = "Lastest News";
		return $parsed_results;
	}

}

?>