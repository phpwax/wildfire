<?php

class CmsApplicationController extends WXControllerBase{
  
  public $cms_section = false;      // Section object
  public $cms_content = false;  // Page/Article Object
  public $content_table = false; // Which table to search for content
  public $section_stack = array();
  public $section_id = 1;
	public $per_page = 4;
  public $crumbtrail = array();
	
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
		$this->build_crumbtrail($all);
		
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
	  for($i=0;$i<=(count($route));$i++) {
	    if($result = $this->get_section(array("url"=>$route[$i]))) {
	      $url.=$result->url."/";
	      $this->crumbtrail[]=array("url"=>$url, "display"=>$result->title);
	    }
	  }
	  if($this->is_page()) $this->crumbtrail[]=array("url"=>$url.$this->cms_content->url."/", "display"=>$this->cms_content->title);	  
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
				if($this->cms_section->parent_id == 1 && $this->cms_section->section_type != 1){
					$this->cms_content = $section->find_all_by_parent_id($options['section']);
				}	
				else {
					if($logged_in) $params['conditions'] = "";
					elseif($this->cms_section->section_type == 1) $params['conditions'] .= " AND (DATE_FORMAT(`published`, '%y%m%d') <=  DATE_FORMAT(NOW(),'%y%m%d')  ) ";
					$children = $section->find_all_by_parent_id($options['section']);
					$ids= array($options['section']);
					foreach($children as $child){ $ids[] = $child->id;}
					$ids = implode(",", $ids);
					$params['conditions'] .= " AND (`cms_section_id` IN ($ids))";
					$params['order'] = "id";
					$params['direction'] = "DESC";
					$params['limit'] = 3;
					$this->cms_content = $content->find_all($params);
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
		if($this->is_page() && $this->is_viewable("page/cms_".$type. "_".$this->cms_content->url) ) $this->use_view =  "cms_".$type. "_".$this->cms_content->url;			
	}
  
  public function is_admin_logged_in(){
		$user = new WXDBAuthenticate(array("db_table"=>"cms_user", "encrypt"=>"false"));
		return $user->is_logged_in();
	}


}




?>