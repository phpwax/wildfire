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

	public function before_save() {
		$this->url = WXInflections::to_url($this->title);
	}	

	public function tree($nodes = false){
		$model_class = get_class($this);
		if($cache_tree = unserialize($this->session_cache_get("section_tree"))) {
			return new RecursiveIteratorIterator(new WaxTreeRecordset($this, $cache_tree), RecursiveIteratorIterator::SELF_FIRST );
		}else{
			$new_tree = $this->build_tree($this->rows() );
			$this->session_cache_set("section_tree", serialize($new_tree));
			return new RecursiveIteratorIterator(new WaxTreeRecordset($this, $new_tree), RecursiveIteratorIterator::SELF_FIRST );
		}
	}

	public function all() {
		$res = $this->db->select($this);
		return new WaxRecordset($this, $res);
	}

	public function build_tree($list) {
		$lookup = array();
		foreach( $list as $item ) {
			$item['children'] = array();
			$lookup[$item['id']] = $item;
		}
		$tree = array();
		foreach( $lookup as $id => $foo ){
			$item = &$lookup[$id];
			if( $item['parent_id'] == 0 ) $tree[$id] = &$item;
			elseif( isset( $lookup[$item['parent_id']] ) ) $lookup[$item['parent_id']]['children'][] = &$item;
			else $tree['_orphans_'][$id] = &$item;
		}
		return array_values($tree);
	}

	public function sections_as_collection($input=false,$padding_char ="&nbsp;&nbsp;") {
		if(!$input) $input = new WaxRecordset(new CmsSection(), $this->tree());
		$collection = array();
		if(!$input) return $collection;
		foreach($input as $item){
			$value = str_pad($item->title, strlen($item->title) + $item->get_level()+1, "^", STR_PAD_LEFT);
			$collection["{$item->id}"] = str_replace("^", $padding_char, $value);
		}
		return $collection;
	}

	public function permalink() {
		$path = array_reverse($this->path_to_root());
		foreach($path as $object) $url .= "/".$object->url;
		$url = str_replace("/home", "", $url);
		return $url;
	}

	public function section_type(){
		return $this->section_types[$this->type];
	}

	protected function session_cache_get($name, $expire="18000") {
		if(Session::get($name)) {
			if(Session::get($name."_cache") > time()-$expire) return Session::get($name);
		}
		return false;
	}

	protected function session_cache_set($name, $value) {
		Session::set($name, $value);
		Session::set($name."_cache", time());
	}
}

?>