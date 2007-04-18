<?php

class CmsApplicationController extends WXControllerBase{
  
  public $cms_section = false;      // Section object
  public $cms_content = false;  // Page/Article Object
  public $content_table = "cms_content"; // Which table to search for content
  public $section_stack = array();
  public $section_id = 1;
	public $per_page = 5;
  public $crumbtrail = array();
	
	public function cms_content() {}
	
	protected function cms_check() {
	  if($this->is_public_method($this, WXInflections::underscore($this->action)) ) {
	    if($this->action=="index") $this->section_stack[]="";
	    else $this->section_stack[]=$this->action;
	    return false;
    }
	  $url = $this->parse_urls();
    $content = array("section_id"=>$this->cms_section->id, "url"=>$url);
    $this->get_content($content);
    $this->pick_view();
		if($this->cms_content) $this->action = "cms_content";
	}
	
	protected function parse_urls() {
	  $stack = $this->route_array;
    array_unshift($stack, $this->action);
    $this->build_crumbtrail($stack);
    while(count($stack)) {
      if($result = $this->get_section($stack[0]) ) {
         $this->cms_section = $result;
         $this->section_stack[]=$stack[0];
       }
      $url = array_shift($stack);
    }
    return $url;
	}
	
	/* Generic dnamic image display method */
	
	public function show_image() {
	  $this->use_layout=false;
	  $this->use_view = "none";
	  if(!isset($this->route_array[1])) $size=110;
	   else $size = $this->route_array[1];
	  $size = str_replace(".jpg", "", $size);
	  $size = str_replace(".gif", "", $size);
	  $size = str_replace(".png", "", $size);
	  
	  $this->show_image = new CmsFile($this->route_array[0]);
    $source = $this->show_image->path.$this->show_image->filename;
    $file = CACHE_DIR.$this->route_array[0]."_".$this->route_array[1];
	  if(!is_readable($file)) File::resize_image($source, $file, $size);	  
	  if($this->image = File::display_image($file) ) return true;
	  return false;
	}
	
	protected function build_crumbtrail($route) {
	  $url = "/";
	  $this->crumbtrail[]=array("url"=>$url, "display"=>"home");
	  for($i=0;$i<(count($route));$i++) {
	    if($result = $this->get_section($route[$i])) {
	      $url.=$result->url."/";
	      $this->crumbtrail[]=array("url"=>$url, "display"=>$result->title);
	    }
	  }
	  if($this->is_page()) $this->crumbtrail[]=array("url"=>$url.$this->cms_content->url."/", "display"=>$this->cms_content->title);	  
	}
	
	/**
	 *  @param $url Url to query for section
	 *  @return CmsSection Object 
	 */
	protected function get_section($url) {
	  $section = new CmsSection;
	  $content = new CmsContent;
	  $res = $section->find_all_by_url($url);
	  if(count($res==1)) return $res[0];
	  elseif(count($res)>1) {
	    $stack=array_reverse($this->section_stack);
	    array_shift($stack);
	    while($res[0]->parent->url !=$stack[0]) array_shift($res);
	    return $res[0];
	  }
	  $id = $content->find_by_url($url)->cms_section_id;
	  die($id);
    if($res = $section->find($id)) return $res;
	  return false;
	}
	
	protected function get_content($options = array()) {
	  $model = WXInflections::camelize($this->content_table, 1);
    $content = new $model;
    if($this->is_admin_logged_in()) $this->cms_content = $content->all_content($options['url'], $options['section_id']);
		else $this->cms_content = $content->published_content($options['url'], $options['section_id']);
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
		if($this->is_page() && $this->is_viewable("page/cms_".$type. "_".$this->cms_content->url) ) $this->use_view =  "cms_".$type. "_".$this->cms_content->url;			
	}
  
  public function is_admin_logged_in(){
		$user = new WXDBAuthenticate(array("db_table"=>"cms_user", "encrypt"=>"false"));
		return $user->is_logged_in();
	}


}




?>