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
		//you've found a page, but no section (this happens for pages within the home section as technically there is no 'home' in the url stack)
		if($this->is_page() && $this->cms_content->id && !$this->cms_section) $this->cms_section = $this->cms_content->section;
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
			//check the formatting - if found then it removes the extension
		  $url = $this->set_formatting($url);
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
	 * - if finds one, set the cms_seciton & return true
	 * - if it finds more than one, then reverse stack, traverse back looking for matching parents & return true
	 * - return false 
	 * @param String $url 
	 * @return Boolean
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
	/**
	 * big monster that finds content
	 * - if the url exists (ie not false) then find content in following priority
	 *   - content with correct url in the correct section
	 *   - content with correct url, discounting the section
	 *   - otherwise throw a 404 
	 * - if url is false 
	 *   - find all the content pages inside the current section
	 *
	 * NOTE: If your logged in to the admin area - unpublished content items are accessible via the permalink, but will not show in lists
	 *
	 * @param string $url 
	 */	
	protected function find_content($url){

		$content = new CmsContent();
		$logged_in = $this->is_admin_logged_in();
		if($url){	
			$url = $this->set_formatting($url); //remove & set the formatting...			
			$filters = array('url'=>$url, 'cms_section_id'=>$this->cms_section->id);
			if($logged_in) $res = $content->clear()->filter($filters)->all();
  		else $res = $content->scope("published")->filter($filters)->all();
			if(count($res) == 0) {
			  if($logged_in) $res = $content->clear()->filter(array('url'=>$url))->all();
			  else $res = $content->clear()->scope("published")->filter(array('url'=>$url))->all();
		  }
			if($res->count() > 0) $this->cms_content = $res[0];
			else throw new WXRoutingException('The page you are looking for is not available', "Page not found", '404');
		}else{
			$filter = "`cms_section_id` = '".$this->cms_section->id."'";	
			if(!$this->this_page) $this->cms_content = $content->scope("published")->filter($filter)->all();
			else $this->cms_content = $content->scope("published")->filter($filter)->page($this->this_page, $this->per_page);
		}
	}
	
	/**
	 * this function creates an internal crumb trail array, can be used for navigation etc
	 */	
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
	
	
	/**
	 * Uses the url passed in to determine what format, returns modified string
	 * @param string $url 
	 * @return string $url
	 */	
	protected function set_formatting($url){
		if(strpos($url, ".")) {
	    $format = substr(strrchr($url,"."), 1);
	    $url = substr($url, 0, strrpos($url, "."));
	    $this->use_format=$format;
	  }
		return $url;
	}
	
	public function show_image() {
	  $options = Request::get("params");
	  $img_id = Request::get("id");
	  $img_size = $options[0];
  	$this->use_view=false;
		$this->use_layout=false;
  	if(!$size = $img_size) $size=110;
  	else $size = substr($size, 0, strrpos($size, "."));
  	$img = new WildfireFile($img_id);
    $img->show($size);
  }
  
  public function file_upload() {
		$str = "";
		foreach($_REQUEST as $k=>$v) $str .= $k.':'.implode("\n",$v).'\n';
		WaxLog::log('error', "[logging]".$str);
	  if($url = $_POST["upload_from_url"]) {
      $path = $_POST['wildfire_file_folder'];
      $fs = new CmsFilesystem;
      $filename = basename($url);
      $ext = strtolower(array_pop(explode(".", $filename)));
      if($_POST["wildfire_file_filename"]) $filename = $_POST["wildfire_file_filename"].".".$ext;
      $filename = File::safe_file_save($fs->defaultFileStore.$path, $filename);
      $file = $fs->defaultFileStore.$path."/".$filename;
      $handle = fopen($file, 'x+'); 
      fwrite($handle, file_get_contents($url));
      fclose($handle);
			$fname = $fs->defaultFileStore.$path."/".$filename;
			chmod($fname, 0777);
			$dimensions = getimagesize($fname);
			if(AdminFilesController::$max_image_width && ($dimensions[0] > AdminFilesController::$max_image_width) ){
				$flag = File::resize_image($fname, $fname,AdminFilesController::$max_image_width, false, true);
				if(!$flag) WaxLog::log('error', '[resize] FAIL');
			}
      $fs->databaseSync($fs->defaultFileStore.$path, $path);
      $file = new WildfireFile;
      $newfile = $file->filter(array("filename"=>$filename, "rpath"=>$path))->first();
      $newfile->description = $_POST["wildfire_file_description"];
      $newfile->save();	
      echo "Uploaded";
    } elseif($_FILES) {
        $path = $_POST['wildfire_file_folder'];
        $fs = new CmsFilesystem;
        $_FILES['upload'] = $_FILES["Filedata"];
        $fs->upload($path);
        $fs->databaseSync($fs->defaultFileStore.$path, $path);
				$fname = $fs->defaultFileStore.$path."/".$_FILES['upload']['name'];
				chmod($fname, 0777);				
        $file = new WildfireFile;
        $newfile = $file->filter(array("filename"=>$_FILES['upload']['name'], "rpath"=>$path))->first();
        $newfile->description = $_POST["wildfire_file_description"];
        $newfile->save();				
        echo "Uploaded";
    } else die("UPLOAD ERROR");
    exit;
	}

	/**
	 * check to see if the cms_content var is indeed a page  
	 * @return void
	 * @author charles marshall
	 */	
	protected function is_page() {
	  if($this->cms_content instanceof CmsContent) return true;
	  return false;
	}
	/**
	 * decides what view should be used - has a more to less specific priority
	 * - cms_CONTENTURL_[list|page]
	 * - cms_SECTIONNAME_[list|page]
	 * - cms_[list|page]
	 */	
	protected function pick_view() {		
	  $sections = array_reverse($this->section_stack);
	  if($this->is_page()) $type="page";
	  else $type="list";
	  $this->use_view="cms_".$type;		
	  foreach($sections as $section) {
	  	if($this->is_viewable("page/cms_".$section."_".$type, $this->use_format)) $this->use_view = "cms_".$section."_".$type;
	  }
		if($this->is_page() && $this->is_viewable("page/cms_".$this->cms_content->url."_".$type,$this->use_format) ) $this->use_view =  "cms_".$this->cms_content->url."_".$type;
	}
	
  /**
   * check to see if admin is logged in
   * @return boolean
   */  
  public function is_admin_logged_in(){
		$user = new WaxAuthDb(array("db_table"=>"wildfire_user", "encrypt"=>"false", "session_key"=>"wildfire_user"));
		return $user->is_logged_in();
	}


	/**** OLD METHODS - WILL BE REMOVED SOON - FOR NOW RETURN FALSE ****/
	protected function cms_check() {
	 return false;
	}	
	protected function parse_urls() {
	 return false;
	}
	protected function build_crumbtrail($route) {
	 return false;
	}
	protected function get_section($url) {
	  return false;
	}
	protected function get_content($options = array(), $params=array()) {
	  return false;
	}
	
}

?>