<?php
/**
 * The main class thats used by the front end to access the
 * cms data, if data is found then this will also set up the actions,
 * views and content - how useful is that!
 * @package PHP-WAX CMS
 * @author charles marshall
 */

class CMSApplicationController extends WaxController{

  public $cms_section = false;	//Section object
  public $cms_content = false;  //this is either an array of the content or a single content record
  public $section_stack = array(); //array of all section found
	public $per_page = 5;	//number of content items to list per page
	public $this_page = 1;	//the current page number
  public $crumbtrail = array();	//a pre built crumb trail
	public $languages = array(0=>"english");
	public $content_model = "CmsContent";
	public $content_scope = "published";
	
	public $raw_stack = array(); //stack from waxurl
	public $cms_stack = array(); //stack of the url
	public $cms_obj_stack = array(); //stack of objects found
	public $cms_content = false;
	public $cms_model = false;
	
	public $previewing = false;
		
	public $cms_view = "";

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
		//add preview bar to output
		if(Request::get("preview"))
		  WaxTemplate::add_response_filter("layout", "cms-preview-bar", array("model"=>"CMSApplicationController","method"=>"add_preview_bar"));
		//method exists check
		if($this->is_public_method($this, Inflections::underscore($this->action)) ) return false;
		if(!$this->use_format) $this->use_format="html";
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
    if($this->is_page() && Config::get('count_pageviews')) $this->cms_content->add_pageview();
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
		
	}

	protected function find_by_permalink($link){
		
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
		
	}


	public function change_language() {
	 $lang_id = Request::get("id");
	 if($this->languages[$lang_id]) Session::set("wildfire_language_id",$lang_id);
	 if($this->referrer) $this->redirect_to($this->referrer);
	 else $this->redirect_to("/");
	}

	public function show_image() {
	  $options = (array)Request::get("params");
	  $img_id = Request::get("id");
	  $img_size = $options[0];
  	$this->use_view=false;
		$this->use_layout=false;
  	if(!$size = $img_size) $size=110;
  	elseif(strrpos($size, ".")>0) $size = substr($size, 0, strrpos($size, "."));
  	$img = new WildfireFile($img_id);
  	$ext = File::get_extension($img->filename);
  	switch($ext) {
  	  case "mp4":
  	  case "mov":
  	  case "avi":
  	  case "m4v":
  	  case "mpg":
  	  case "flv":
  	    $this->redirect_to("/images/fs/large/video.png");exit;break;
  	  case "xls":
  	  case "csv":
	      $this->redirect_to("/images/fs/large/excel.png");exit;break;
	    case "wav":
	    case "wma":
	    case "aac":
	    case "mp3":
	      $this->redirect_to("/images/fs/large/mp3.png");exit;break;
	    case "swf":
	      $this->redirect_to("/images/fs/large/flash.png");exit;break;
	    case "docx":
	    case "txt":
	    case "doc":
	      $this->redirect_to("/images/fs/large/word.png");exit;break;
	    case "ppt":
	      $this->redirect_to("/images/fs/large/powerpoint.png");exit;break;
	    case "pub":
	      $this->redirect_to("/images/fs/large/publisher.png");exit;break;
	    case "mdb":
	      $this->redirect_to("/images/fs/large/access.png");exit;break;
	    case "pdf":
	      $this->redirect_to("/images/fs/large/pdf.png");exit;break;
  	}
    $img->show($size);
  }

	
	/**
	 * decides what view should be used - has a more to less specific priority
	 * also switches the layout to a language specific one, if it exists
	 * - cms_CONTENTURL_[list|page][_language]
	 * - cms_SECTIONNAME_[list|page][_language]
	 * - cms_[list|page][_language]
	 */
	protected function pick_view() {
	  
	}

	/**
	 * this function adds a preview bar to the top of content, so that users won't be confused that their preview differs from the live content
	 *
	 * @param string $buffer_contents
	 * @return void
	 * @author Sheldon
	 */
	public function add_preview_bar($buffer_contents, $template = false){
	  WaxTemplate::remove_response_filter("layout", "cms-preview-bar");
	  $preview_bar = partial("../../plugins/cms/view/shared/_preview_bar", $template, "html");
	  $buffer_contents = preg_replace("/(<\/head>)/",'<link type="text/css" href="/stylesheets/cms/preview-bar.css" rel="stylesheet" />$1', $buffer_contents);
	  $buffer_contents = preg_replace("/(<body.*?>)/","$1".$preview_bar, $buffer_contents);
	  return $buffer_contents;
	}

  /**
   * check to see if admin is logged in
   * @return boolean
   */
  public function is_admin_logged_in(){
		$user = new WaxAuthDb(array("db_table"=>"wildfire_user", "encrypt"=>"false", "session_key"=>"wildfire_user_cookie"));
		return $user->is_logged_in();
	}


  public function file_upload() {
	  if($urldecode = post("upload_from_url")) {
      $path = post('wildfire_file_folder');
      $fs = new CmsFilesystem;
      $filename = basename($urldecode);
      $ext = strtolower(array_pop(explode(".", $filename)));
      if(post("wildfire_file_filename")) $filename = post("wildfire_file_filename").".".$ext;
      $filename = $_POST["wildfire_file_filename"] = File::safe_file_save($fs->defaultFileStore.$path, $filename);
      $file = $fs->defaultFileStore.$path."/".$filename;
      $handle = fopen($file, 'x+');
      fwrite($handle, file_get_contents($urldecode));
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
			//if these are set then attach the image to the doc!
			if(Request::post('content_id') && Request::post('model_string') && Request::post('join_field') ){
				$model_id = Request::post('content_id');
				$class = Inflections::camelize(Request::post('model_string'), true);
				$field = Request::post('join_field');
				$model = new $class($model_id);
				$model->$field = $newfile;
			}
      echo "Uploaded";
    } elseif($_FILES) {
      $path = $_POST['wildfire_file_folder'];
      $fs = new CmsFilesystem;
      $_FILES['upload'] = $_FILES["Filedata"];
			$_FILES['upload']['name'] = str_replace(' ', '', $_FILES['upload']['name']);
      $fs->upload($path);
      $fs->databaseSync($fs->defaultFileStore.$path, $path);
			$fname = $fs->defaultFileStore.$path."/".$_FILES['upload']['name'];
			if($dimensions = getimagesize($fname)) {
			  if($dimensions[2]=="7" || $dimensions[2]=="8") {
					WaxLog::log("error", "Detected TIFF Upload");
					$command="mogrify ".escapeshellcmd($fname)." -colorspace RGB -format jpg";
					system($command);
					$newname = str_replace(".tiff", ".jpg",$fname);
					$newname = str_replace(".tif", ".jpg",$newname);
					rename($fname, $newname);
				}
			}

			@chmod($fname, 0777);
      $file = new WildfireFile;
      $newfile = $file->filter(array("filename"=>$_FILES['upload']['name'], "rpath"=>$path))->first();
      $newfile->description = $_POST["wildfire_file_description"];
			$newfile->save();
			//if these are set then attach the image to the doc!
			if(Request::post('content_id') && Request::post('model_string') && Request::post('join_field') ){
				$model_id = Request::post('content_id');
				$class = Inflections::camelize(Request::post('model_string'), true);
				$field = Request::post('join_field');
				$model = new $class($model_id);
				$model->$field = $newfile;
			}
			WaxLog::log("error", "Should Be Uploaded");
      echo "Uploaded";
    } else die("UPLOAD ERROR");
    exit;
	}

  /**
   * this series of methods is for handling posted emails and creating content from them
   * see mail-input.sh for how the mail gets forwarded into this script
   *
   * incoming mail setup:
   *
   * setup postfix (or another mail handler) on the server to accept mail for a domain that also points to the virtual host
   * (on ubuntu apt install postfix and then run 'dpkg-reconfigure postfix', follow instructions)
   * add '<username>: <username>, "|/home/<username>/plugins/cms/mail-input.sh"' to /etc/aliases
   * run newaliases
   *
   */
  private function wildfire_email_parse($email_string){
    $parts = explode("\n\n", $email_string);
    $header_string = array_shift($parts);
    $use = array('From:', "Subject:", "Content-Type:", "boundary=", "Content-Transfer-Encoding:");
    $headers = array();
    foreach(explode("\n", $header_string) as $item){
      foreach($use as $param) if(substr($item,0, strlen($param)) == $param) $headers[$param] = substr($item, strlen($param)+1);
    }

    $body = implode("\n\n",$parts);
    if(strstr($headers['Content-Type:'], 'multipart')){
      $headers['boundary='] = trim($headers['boundary='], '"');
      $email = array('headers'=>$headers);
      foreach(explode("--".$headers['boundary='], $body) as $i=>$part){
        if($part && ($res = $this->wildfire_email_parse($part)) && $res['body'] ) $email[] = $res;
        if($part && ($res = $this->wildfire_email_parse($part)) && $res[0]['body'] ) foreach($res as $r) $email[] = $r;
      }
      return $email;
    }else{
      preg_match("/.*?charset=(.*)/i", $headers['Content-Type:'], $matches);
      if($matches && $matches[1]) $body = iconv(trim($matches[1], '"'), "UTF-8", $body);
      if($headers['Content-Transfer-Encoding:'] == "quoted-printable") $body = quoted_printable_decode($body);
      if($headers['Content-Transfer-Encoding:'] == "base64") $body = base64_decode($body);
      return array('body'=>$body, 'headers'=>$headers);
    }
    return false;
  }

  public function wildfire_email_new_content(){
    $this->use_layout = $this->use_view = false;
    WaxLog::log('error', '[wildfire_email_new_content] triggered');
    if($_SERVER['REMOTE_ADDR'] != $_SERVER['SERVER_ADDR']){
      WaxLog::log("error","[wildfire email content input] Security error, someone tried to hit the email input url from somewhere other than localhost. _SERVER Dump:\n".print_r($_SERVER, 1));
      exit;
    }

    $email = file_get_contents("php://input");
    $parsed_email = $this->wildfire_email_parse(file_get_contents(Request::param('fname')));
    $converted = $bodies = $headers = array();
    $headers[] = $parsed_email['headers'];
    foreach($parsed_email as $k=>$v){
      if($k == "body" && !is_array($v)) $bodies[] = $v;
      elseif(is_numeric($k) && $v['headers'] && $v['body']){
        $bodies[] = $v['body'];
        $headers[] = $v['headers'];
      }
    }
    foreach($bodies as $i => $c){
      $header = $headers[($i+1)];
      if(strstr($header['Content-Type:'], "html")) $html_email = array('header'=>$headers[0], 'body'=>$c);
      else $text_email = array('header'=>$headers[0], 'body'=>$c);
    }
    
    if($text_email) $email = $text_email;
    else if($html_email) $email = $html_email;
    if(!$email){
      WaxLog::log('error', '[wildfire_email_new_content] email error');
      exit;
    }
    $email['headers'] = $parsed_email['headers'];

    $new_email = array('body'=>$email['body']);
    foreach($email['headers'] as $k=>$v) $new_email['header'][str_replace(":", "", str_replace("=", "",strtolower($k)))] = $v;
    
    if($email && $this->wildfire_email_post_process($new_email)) echo "content created";
    else echo "error creating content";
    exit;
  }

  /**
   * made these a separate function so it can be overridden on each site
   */
  public function wildfire_email_post_process($email){
    $new_content = new CmsContent;
    $new_content->status = 0;
    $new_content->title = $email["header"]["Subject"];
    $new_content->content = $email["body"];
    $new_content->save();
    if(!$new_content->errors) return true;
  }
}

?>