<?php

class CmsApplicationController extends WXControllerBase{
  
  public $cms_section = false;      // Section object
  public $cms_content = false;  // Page/Article Object
  public $content_table = false; // Which table to search for content
  public $section_stack = array();
  public $section_id = 1;
	public $per_page = 4;
	
	public function cms_content() {}
	
	protected function cms_check() {
	  if($this->is_public_method($this, WXInflections::underscore($this->action)) ) return false;
	  
	  $stack = $this->route_array;
	  $offset = 0;	
    array_unshift($stack, $this->action);
		$all = $stack;
    while(count($stack)) {
      if($result = $this->get_section(array("url"=>$stack[0])) ) {
         $this->cms_section = $result;
         $offset ++;
         $this->section_stack[]=$stack[0];
       }
      $url = array_shift($stack);
    }
    $this->setup_content_table();
		if($this->cms_section->id) $this->section_id = $this->cms_section->id;
    if(!$url) $url = $this->action;
		
    $content = array("section"=>$this->section_id, 'section_url'=>$this->cms_section->url,"url"=>$url);
    $this->get_content($content);		
    $this->pick_view();
		if($this->cms_content) $this->action = "cms_content";
		
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
		$section = new CmsSection();
		$user = new WXDBAuthenticate(array("db_table"=>"cms_user", "encrypt"=>"false"));
		$logged_in = $user->is_logged_in();
		$params = array('conditions'=>"status=1 ");
		//page
	  if($options['section'] && strlen($options['url'])>1 && ($options['section_url'] != $options['url'])) {		
			if($logged_in) $this->cms_content = $content->find_by_url_and_cms_section_id($options['url'], $options['section']);	
			else{
				$params['conditions'] .= "AND url='$options[url]' AND `cms_section_id`=$options[section]";
				$this->cms_content = $content->find_first($params);
			}
	  //section		
	  } elseif($options['section']) {	
			if($logged_in) $this->cms_content = $section->find_all_by_parent_id($options['section']);
			else{
				$params['conditions'] .= "AND `parent_id`=$options[section]";
				$this->cms_content = $section->find_all($params);
			}
	  } elseif($options['url']) {		
			if($logged_in) $this->cms_content = $content->find_by_url_and_cms_section_id($options['url'], 1);	
			else{
				$params['conditions'] .= "AND url='$options[url]' AND `cms_section_id`=1";
				$this->cms_content = $content->find_first($params);
			}
	  }
	}	
	protected function setup_content_table() {
	  if($this->cms_section->section_type == 1) {
		  $this->content_table = "cms_article";
	  } else $this->content_table = "cms_page";
	}
	
	protected function is_page() {
	  if(!is_array($this->cms_content) && $this->cms_content) return true;
	  return false;
	}
	
	protected function pick_view() {		
	  $sections = array_reverse($this->section_stack);
	  if($this->is_page()) $type="page";
	  else $type="list";
	  $this->use_view="cms_".$type;		
	  foreach($sections as $section) {
	  	if($this->is_viewable("page/cms_".$section."_".$type)) $this->use_view = "cms_".$section."_".$type;
			
	  }
	}
  
  


}




?>