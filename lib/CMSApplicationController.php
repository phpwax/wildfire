<?php

class CmsApplicationController extends WXControllerBase{
  
  public $section = false;      // Section object
  public $cms_content = false;  // Page/Article Object
	
	protected function cms_check() {
	  if($this->is_public_method($this, WXInflections::underscore($this->action)) ) return false;	
    $stack = $this->route_array;
    while($this->section = $this->get_section(array("url"=>$stack[0]))) {
      array_shift($stack);
    }
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
	
	
	

	
	public function cms_action(){
	  $section_url = WXInflections::underscore($this->cms_section->url);
	  $sub_url = WXInflections::underscore($this->sub_url);
		$this->set_views($section_url, "layout");
		if($this->is_news_section()) $this->set_views("shared/_cms_news", "view");
		elseif($this->summary_section) $this->set_views("shared/_cms_summary", "view");
		else $this->set_views("shared/_cms_article_page", "view");
		$this->set_views("shared/".$section_url, "view");
		if( ($sub_url) ){
		  $this->set_views("shared/_cms_article_page", "view");
		  $this->set_views("shared/".$sub_url, "view");
		  $this->set_views("shared/".$section_url."_".$sub_url, "view");
		} 
	}
	


}




?>