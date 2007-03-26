<?php

class CmsPage extends WXActiveRecord{
  
  public $status_options = array("0"=>"Draft", "1"=>"Published");

	public function after_setup() {
		$this->has_many("cms_file", "images");
 	  $this->has_many("cms_category", "categories");
	}
  
  public function validations() {
 		$this->valid_unique("url");
 	}
 	
 	public function page_status() {
 	  return $this->status_options[$this->status];
 	}
 	
 	public function find_with_url($url) {
 	  return $this->find_by_url($url, array("options"=>"published = 1"));
 	}

 	public function find_with_title($title) {
 	  $title = WXInflections::dasherize($title);
 	  return $this->find_by_title($title, array("options"=>"published = 1"));
 	}
 	
 	public function before_save() {
 	  $this->url = WXInflections::to_url($this->title);
 	  $this->avoid_section_url_clash();
 	}
 	
	public function parent_name(){
		$record = $this->parent;
		return $record->title;
	}
	
	public function sections() {
		$section = new CmsSection;
		return $section->filtered_sections(0);
	}
	
	public function section() {
		$section = new CmsSection;
		return $section->find($this->cms_section_id)->title;
	}
	
	public function section_url() {
		$section = new CmsSection;
		return $section->find($this->cms_section_id)->url;
	}
	
	public function permalink() {
	  $section = new CmsSection($this->cms_section_id);
	  return $section->permalink()."/".$this->url;
	}
	
	public function avoid_section_url_clash() {
	  $section = new CmsSection;
	  if($section->find_by_url($this->url)) $this->url= $this->url."-info";
	}
 	
}
?>