<?php
class WildfireSection extends WaxModel{
	public function setup(){
		$this->define("title", "CharField", array('maxlength'=>255));
		$this->define("parent_id", "IntegerField", array('maxlength'=>5));
		$this->define("introduction", "TextField");
		$this->define("order", "IntegerField", array('maxlength'=>2));
		$this->define("url", "CharField", array('maxlength'=>255));
		$this->define("oldid", "IntegerField");
	}
	public function before_save() {
		$this->url = WXInflections::to_url($this->title);
	}
}
?>