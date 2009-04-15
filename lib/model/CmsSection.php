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
		$this->define("pages", "HasManyField", array('target_model'=>'CmsContent','editable'=>false));
	}

	public function before_save() {
		$this->url = WXInflections::to_url($this->title);
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


}

?>