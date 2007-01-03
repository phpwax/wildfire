<?php

class CmsPage extends CMSActiveRecord{
  
  public $status_options = array("0"=>"draft", "1"=>"published");
  
  public function validations() {
 		$this->valid_unique("url");
 	}
 	
 	public function page_status() {
 	  return $this->status_options[$this->published];
 	}
 	
 	public function find_with_url($url) {
 	  return $this->find_by_url($url, array("options"=>"published = 1"));
 	}

 	public function find_with_title($title) {
 	  $title = WXInflections::dasherize($title);
 	  return $this->find_by_title($title, array("options"=>"published = 1"));
 	}
 	
 	public function before_insert() {
 	  $this->url = WXInflections::dasherize($this->title);
 	}
 	
	public function parent_name(){
		$record = $this->parent;
		return $record->title;
	}
 	
}
?>