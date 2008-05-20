<?php

class CmsSection extends WaxModel {
	
	public function setup() {
     $this->define("title", "CharField");
     $this->define("parent_id", "ForeignKey", array("model_name"=>"WildfireSection"));
     $this->define("introduction", "TextField");
     $this->define("order", "IntegerField", array("default"=>0));
     $this->define("url", "CharField");
	}
	
	public function before_save() {
		$this->url = Inflections::to_url($this->title);
	}
	
	public function find_ordered_sections() {
    $this->order="order ASC";
		return $this->all();
	}
	
	public function permalink() {
	  return $this->url;
	}
	
	public function prevent_orphans($information, $value){
		if(!is_array($information) || !$value || $value == 1) return false;
		$sql = 'UPDATE `' . $information['table'] .'` SET `'.$information['field']."` = '".$information['new_parent_id']."' WHERE `".$information['field']."` = $value";
		$this->pdo->exec($sql);
	}
		 
}

?>