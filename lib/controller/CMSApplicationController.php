<?php

class CmsApplicationController extends WXControllerBase{
  
  public $cms_section = false;      // Section object
  public $cms_content = false;  // Page/Article Object
  public $content_table = "cms_content"; // Which table to search for content
  public $section_stack = array();
  public $section_id = 1;
	public $per_page = 5;
	public $this_page = "1";
  public $crumbtrail = array();
	public $force_image_width = false;
	
	public function cms_content() {}
	
	protected function cms_check() {
	  if($this->param("page")) $this->this_page=$this->param("page");
	  if($this->is_public_method($this, WXInflections::underscore($this->action)) ) {
	    if($this->action=="index") $this->section_stack[]="";
	    else $this->section_stack[]=$this->action;
	    return false;
    }
	  $url = $this->parse_urls();
	  $content = array("section_id"=>$this->cms_section->id, "url"=>$url);
	  $params = array();
    if($this->per_page) {
      $params["per_page"] = $this->per_page;
      $params["page"] = $this->this_page;
    } 
    $this->get_content($content, $params);
    $this->pick_view();
		if($this->cms_content) $this->action = "cms_content";
    if($this->is_page()) $this->cms_content->add_pageview();
    print_r($this); exit;
	}
	
	protected function parse_urls() {
	  $stack = $this->route_array;
	  if(class_exists("Request")) $stack = Request::$params;
    array_unshift($stack, $this->action);
    print_r($stack); exit;
    foreach($stack as $k=>$v) {
      if(is_numeric($k)) {
        if($result = $this->get_section($v) ) {
           $this->cms_section = $result;
           $this->section_stack[]=$v;
         }
      }
    }
    $this->build_crumbtrail($this->section_stack);
    return end($this->section_stack);
	}
	
	/* Generic dynamic image display method */
	
	public function show_image() {
	  $this->use_layout=false;
	  $this->use_view = "none";
	  if(!isset($this->route_array[1])) $size=110;
	   else $size = $this->route_array[1];
	  $size = str_replace(".jpg", "", $size);
	  $size = str_replace(".gif", "", $size);
	  $size = str_replace(".png", "", $size);
	  
	  $this->show_image = new CmsFile($this->route_array[0]);
	  $imgid =$this->route_array[0];
		/* CHANGED - allows for relative paths in db */
    $source = WAX_ROOT . $this->show_image->path.$this->show_image->filename;
    $relative = strstr($source, "public/");
    $relative = str_replace("public/", "", $relative);
    $source = PUBLIC_DIR.$relative;
    $file = CACHE_DIR.$imgid."_".$size.$this->show_image->extension;
	  if(!is_readable($file)) File::resize_image($source, $file, $size, false, $this->force_image_width);
	  if($this->image = File::display_image($file) ) return true;
	  return false;
	}
	
	protected function build_crumbtrail($route) {
	  $url = "/";
	  $this->crumbtrail[]=array("url"=>$url, "display"=>"Home");
	  $section = new CmsSection;
	  foreach($route as $v) {
	    if($result = $section->find_by_url($v)) {
	      $this->crumbtrail[]=array("url"=>$result->permalink, "display"=>$result->title);
	    }
	  }
	}
	
	/**
	 *  @param $url Url to query for section
	 *  @return CmsSection Object 
	 */
	protected function get_section($url) {
	  $section = new CmsSection;
	  $content = new CmsContent;
	  $res = $section->find_all_by_url($url);
	  if(count($res)==1) return $res[0];
	  elseif(count($res)>1) {
	    $stack=array_reverse($this->section_stack);
	    array_shift($stack);
	    while($res[0]->parent->url !=$stack[0]) array_shift($res);
	    return $res[0];
	  }
	  $id = $content->find_by_url($url)->cms_section_id;
	  if($id == null) throw new WXRoutingException('404');
    if($res = $section->find($id)) return $res;
	  return false;
	}
	
	protected function get_content($options = array(), $params=array()) {
	  $model = WXInflections::camelize($this->content_table, 1);
    $content = new $model;
    $this->cms_content = $content->published_content($options['url'], $options['section_id'], $params);
	}	
	
	
	protected function is_page() {
	  if($this->cms_content instanceof CmsContent) return true;
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
		$user = new WXDBAuthenticate(array("db_table"=>"wildfire_user", "encrypt"=>"false", "session_key"=>"wildfire_user"));
		return $user->is_logged_in();
	}


}




?>