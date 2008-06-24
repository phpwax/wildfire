<?php
/**
 * The main class thats used by the front end to access the 
 * cms data, if data is found then this will also set up the actions,
 * views and content - how useful is that!
 * @package PHP-WAX CMS
 * @author charles marshall
 */

class CmsApplicationController extends WXControllerBase{
  
  public $cms_section = false;	//Section object
  public $cms_content = false;  //this is either an array of the content or a single content record
  public $content_table = "cms_content"; // Which table to search for content
  public $section_stack = array(); //array of all section found
  public $section_id = 1; //default seciton id
	public $per_page = 5;	//number of content items to list per page
	public $this_page = 1;	//the current page number
  public $crumbtrail = array();	//a pre built crumb trail
	public $force_image_width = false;
	
	//default action when content/section is found
	public function cms_content() {}
	
	/**
	 * MAIN FUNCTION - CALL IN YOUR controller_global
	 * This chappy uses the url to find the section & content thats appropriate by calling a bunch of others
	 *
	 * If the url your requesting sets an action (ie the first part of the url after the controller) and that
	 * action is a function within the controller then this will return false!
	 */	
	protected function cms(){
		//check if this is paginated
		if($page = Request::get('page')) $this->this_page = $page;
		//method exists check
		if($this->is_public_method($this, WXInflections::underscore($this->action)) ) return false;
		//get the content!
		$this->find_contents_by_path();
		//set the view
		$this->pick_view();
		//set the action
		if($this->cms_content) {
			$this->action = "cms_content";
			$this->build_crumb();
		}
		//incremeant the page views counter
    if($this->is_page()) $this->cms_content->add_pageview();
	}
	/**
	 * Using the route array this function:
	 *  - creates a stacking order, 
	 *  - traverses the stack,
	 *  - checks for extension names (ie if you add .xml it will look for a view with .xml),
	 *  - checks that the part your looking for is a number (to discount get vars) & looks up the section
	 *  - adds the url to the stack
	 * If the initial stack has something left in it (ie a content url) look for that or look for all content in the section
	 */	
	protected function find_contents_by_path(){
		//need to replace this with request method, once thats been made
		$stack = $this->route_array;
		foreach($stack as $key => $url){
		  if(strpos($url, ".")) {
		    $format = substr(strrchr($url,"."), 1);
		    $url = substr($url, 0, strrpos($url, "."));
		    $this->use_format=$format;
		  }
			//only check numeric keys, ie not page or search terms && check its a section
			if(is_numeric($key) && $this->find_section($url)){
				$this->section_stack[] = $url;
				unset($stack[$key]);
			}elseif(!is_numeric($key)) unset($stack[$key]);
		}
		//if theres something left in the stack, find the page
		if(count($stack)) $this->find_content(end($stack));
		//otherwise this is a section, so find all content in the section
		else $this->find_content(false);
	}
	
	/**
	 * Takes the url passed in and tries to find a section with a matching url
	 * - if finds one, return just the 
	 * @param string $url 
	 */	
	protected function find_section($url){
		$section = new CmsSection;
		$res = $section->filter(array('url'=>$url))->all();
		if(count($res)==1){
			$this->cms_section = $res[0];
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
		  if(strpos($url, ".")) {
		    $format = substr(strrchr($url,"."), 1);
		    $url = substr($url, 0, strrpos($url, "."));
		    $this->use_format=$format;
		  }
		  
			$filters = array('url'=>$url, 'cms_section_id'=>$this->cms_section->id);
			if($this->is_admin_logged_in()) $res = $content->clear()->filter($filters)->all();
  		else $res = $content->scope("published")->filter($filters)->all();
			if(count($res) == 0) {
			  if($this->is_admin_logged_in()) $res = $content->clear()->filter(array('url'=>$url))->all();
			  else $res = $content->clear()->scope("published")->filter(array('url'=>$url))->all();
		  }
			if($res->count()>0) $this->cms_content = $res[0];
			else throw new WXRoutingException('The page you are looking for is not available', "Page not found", '404');
		}else{
			$filter = "`cms_section_id` = '".$this->cms_section->id."'";	
			if(!$this->this_page) $this->cms_content = $content->scope("published")->filter($filter)->all();
			else $this->cms_content = $content->scope("published")->filter($filter)->page($this->this_page, $this->per_page);
		}
	}
	//use the path to root to create - new build crumb function
	protected function build_crumb(){
		if($this->cms_section->id) $path_to_root = array_reverse($this->cms_section->path_to_root());
		else $path_to_root = array();
		foreach($path_to_root as $count => $path){
			if($count > 0) $url = $this->crumbtrail[($count-1)]['url']  . $path->url;
			else $url = "/";
			$this->crumbtrail[]=array("url"=>$url, "display"=>$path->title);
		}
		if(!is_array($this->cms_content)) $this->crumbtrail[] = array('url'=>$this->cms_content->permalink, 'display'=>$this->cms_content->title);
	}
	
	/* used by old and new */
	public function show_image() {
	  $options = WaxUrl::get_params();
	  $img_id = WaxUrl::get("id");
	  $img_size = $options["params"][0];
  	$this->use_view=false;
		$this->use_layout=false;
  	if(!$size = $img_size) $size=110;
  	$img = new WildfireFile($img_id);
  	$size = substr($size, 0, strrpos($size, "."));
		/* CHANGED - allows for relative paths in db */
    $source = PUBLIC_DIR. $img->rpath."/".$img->filename;    

		$file = CACHE_DIR.$img_id."_".$img_size;

		$source=preg_replace("/[\s]/", "\ ", $source);

		if(!File::is_image($source)){
			if(!is_file($file) || !is_readable($file)) {
				$icon_type = File::get_extension($img->filename);
				$icon = PLUGIN_DIR."cms/resources/public/images/cms/"."cms-generic-icon-".strtolower($icon_type).".gif";
				if(!is_readable($icon) || $icon_file !=file_get_contents($icon)) {
					$icon_file = PLUGIN_DIR."cms/resources/public/images/cms/"."cms-generic-icon.png";
					$source = CACHE_DIR."cms-generic-icon.gif";
				}
				else $source = CACHE_DIR."cms-generic-icon-{$icon_type}.gif";
				file_put_contents($source, $icon_file);
			}
		}
    if(!is_file($file) || !is_readable($file)) {
      File::resize_image($source, $file, $size);
    }
		if($this->image = File::display_image($file) ) {
			return true;
		} return false;
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
	  $res = $section->filter(array("url"=>$url))->all();
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
	
}

?>