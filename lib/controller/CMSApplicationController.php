<?php

class CmsApplicationController extends WXControllerBase{
  
  public $cms_section = false;      // Section object
  public $cms_content = false;  // Page/Article Object
  public $content_table = "cms_content"; // Which table to search for content
  public $section_stack = array();
  public $section_id = 1;
	public $per_page = 5;
	public $this_page = 1;
  public $crumbtrail = array();
	public $force_image_width = false;
	
	public function cms_content() {}
	
	protected function cms(){
		if($page = Request::get('page')) $this->this_page = $page;
		if($this->is_public_method($this, WXInflections::underscore($this->action)) ) return false;
		$this->find_contents_by_path();
		$this->pick_view();
		if($this->cms_content) {
			$this->action = "cms_content";
			$this->build_crumb();
		}
    if($this->is_page()) $this->cms_content->add_pageview();
	}
	
	protected function find_contents_by_path(){
		//need to replace this with request method, once thats been made
		$stack = $this->route_array;
		foreach($stack as $key => $url){
			//only check numeric keys, ie not page or search terms && check its a section
			if(is_numeric($key) && $this->find_section($url)){
				$this->section_stack[] = $url;
				unset($stack[$key]);
			}
		}
		//if theres something left in the stack, find the page
		if(count($stack)) $this->find_content(end($stack));
		//otherwise this is a section, so find all content in the section
		else $this->find_content(false);
	}
	
	/* this no sets the cms_section object and only checks by using cms_section */
	protected function find_section($url){
		$section = new CmsSection;
		$res = $section->filter(array('url'=>$url))->all();
		if(count($res)==1){
			$this->cms_section = $res->first();
			return true;
		}elseif(count($res)>1){
			$stack = array_reverse($this->section_stack);
			//if empty, add home section
			if(!count($stack)) $stack[] = "home";
			foreach($res as $result){
				if($result->parent->url == $stack[0]) $this->cms_section = $result;
			}
			return true;
		}else return false;
	}
	
	protected function find_content($url){
		$content = new CmsContent();
		$logged_in = $this->is_admin_logged_in();
		if($url){
			$filters = array('url'=>$url, 'cms_section_id'=>$this->cms_section_id);
			if($logged_in) $res = $content->filter($filters)->all();
			else $res = $content->filter($filters)->filter("`published` <= NOW()")->all();
			if(count($res) == 0 && $logged_in) $res = $content->clear()->filter(array('url'=>$url))->all();
			elseif(count($res) == 0) $res = $content->clear()->filter(array('url'=>$url))->filter("`published` <= NOW()")->all();
			if($res->count()>0) $this->cms_content = $res->first();
			else throw new WXRoutingException('404');
		}else{
			$filter = "`cms_section_id` = '".$this->cms_section->id."'";
			if(!$this->is_admin_logged_in()) $filter .= " AND published <= NOW()";	
			if(!$this->this_page) $this->cms_content = $content->filter($filter)->all();
			else $this->cms_content = $content->filter($filter)->page($this->this_page, $this->per_page);
		}
	}
	//use the path to root to create - new build crumb function
	protected function build_crumb(){
		$path_to_root = array_reverse($this->cms_section->array_to_root());
		foreach($path_to_root as $count => $path){
			if($count > 0) $url = $this->crumbtrail[($count-1)]['url']  . $path->url;
			else $url = "/";
			$this->crumbtrail[]=array("url"=>$url, "display"=>$path->title);
		}
		if(!is_array($this->cms_content)) $this->crumbtrail[] = array('url'=>$this->cms_content->permalink, 'display'=>$this->cms_content->title);
	}
	
	/* used by old and new */
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
    $source = WAX_ROOT . $this->show_image->path.$this->show_image->filename;
    $relative = strstr($source, "public/");
    $relative = str_replace("public/", "", $relative);
    $source = PUBLIC_DIR.$relative;
    $file = CACHE_DIR.$imgid."_".$size.$this->show_image->extension;
	  if(!is_readable($file)) File::resize_image($source, $file, $size, false, $this->force_image_width);
	  if($this->image = File::display_image($file) ) return true;
	  return false;
	}

	/* used by old and new */
	protected function is_page() {
	  if($this->cms_content instanceof CmsContent) return true;
	  return false;
	}
	/* used by old and new */	
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
		$user = new WaxAuthDb(array("db_table"=>"wildfire_user", "encrypt"=>"false", "session_key"=>"wildfire_user"));
		return $user->is_logged_in();
	}


	/**** OLD METHODS - WILL BE REMOVED SOON ****/
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
	}
	
	protected function parse_urls() {
	  $stack = $this->route_array;
    array_unshift($stack, $this->action);
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
    if($this->is_admin_logged_in()) $this->cms_content = $content->all_content($options['url'], $options['section_id'], $params);
		else $this->cms_content = $content->published_content($options['url'], $options['section_id'], $params);
	}
	
}

?>