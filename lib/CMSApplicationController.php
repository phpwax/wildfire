<?php

class CmsApplicationController extends WXControllerBase{
  
  public $cms_section = false;      // Section object
  public $cms_content = false;  // Page/Article Object
  public $content_table = false; // Which table to search for content
  public $section_stack = array();
  public $section_id = 0;
	public $per_page = 4;
	
	protected function cms_check() {
	  if($this->is_public_method($this, WXInflections::underscore($this->action)) ) return false;
	  $stack = $this->route_array;
	  $offset = 0;	
    array_unshift($stack, $this->action);
    while(count($stack)) {
      if($result = $this->get_section(array("url"=>$stack[0])) ) {
         $this->cms_section = $result;
         $offset ++;
         $this->section_stack[]=$stack[0];
       }
      array_shift($stack);
    }
    $this->setup_content_table();
    $this->section_id = $this->cms_section->id;
    if(!$url = $this->route_array[$offset-1]) $url = $this->action;
    $content = array("section"=>$this->cms_section->id, "url"=>$url);
    $this->get_content($content);
    $this->pick_view();
	}
	
	
	/**
	 *  @param $options Set of options to query for section
	 *  @return boolean 
	 */
	protected function get_section($options = array()) {
	  $section = new CmsSection;
	  if($options['url']) return $section->find_by_url($options['url']);
	  if($options['id']) return $section->find($options['id']);
	  if($options['parent']) {
	    $child = $section->find($options['parent'])->parent_id;
	    return $section->find($child);
	  }
	  return false;
	}
	
	protected function get_content($options = array()) {
	  $model = WXInflections::camelize($this->content_table, 1);
    $content = new $model;
	  if($options['section'] && strlen($options['url'])>1) {
	    $this->cms_content = $content->find_by_url_and_cms_section_id($options['url'], $options['section']);
	  }
	  elseif($options['section']) {
	    $this->cms_content = $content->find_all_by_cms_section_id($options['section']);
	  }
	  elseif($options['url']) {
	    $this->cms_content = $content->find_by_url_and_cms_section_id($options['url'], "1");
	  }
	}
	

	
	protected function setup_content_table() {
	  if($this->cms_section->section_type == 1) {
		  $this->content_table = "cms_article";
	  } else $this->content_table = "cms_page";
	}
	
	protected function is_page() {
	  if($this->content) return true;
	  return false;
	}
	
	protected function pick_view() {
	  $sections = array_reverse($this->section_stack);
	  if($this->is_page()) $type="page";
	  else $type="list";
	  $this->use_view="cms_".$type;
	  foreach($sections as $section) {
	    if($this->is_viewable("cms_".$section."_".$type)) $this->use_view("cms_".$section."_".$type);
	  }
	}
  
  


}




?>