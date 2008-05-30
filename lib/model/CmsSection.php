<?php

class CmsSection extends WaxTreeModel {
	
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
	
	
	
	public function sections_as_collection($input=false,$padding_char ="&nbsp;&nbsp;") {
		if(!$this->tree_array && !$input) $this->generate_tree();
		if(!$input) $input = $this->tree_array;
		$collection = array();
		foreach($input as $item){
			$value = str_pad($item->title, strlen($item->title) + $item->level(), "^", STR_PAD_LEFT);
			$collection["{$item->id}"] = str_replace("^", $padding_char, $value);
		}
		return $collection;
	}
	
	public function permalink() {
		$stack = array();
		if(!$this->root_node->id) $this->get_root();
		$root_id = $this->root_node->id;
		//if this is the root section, return this url
		if($this->id == $root_id) return "/".$this->url;
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
	public function find_ordered_sections($parent_section = false) {
		if(!$this->tree_array) $this->generate_tree();
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