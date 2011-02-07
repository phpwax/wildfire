<?php
/**
 * The main class thats used by the front end to access the
 * cms data, if data is found then this will also set up the actions,
 * views and content - how useful is that!
 * @package PHP-WAX CMS
 * @author charles marshall
 */

class CMSApplicationController extends WaxController{


	public $per_page = 5;	//number of content items to list per page
	public $this_page = 1;	//the current page number

  public $language_param = "language";
	public $cms_language_id = false;

	public $cms_mapping_class = "WildfireUrlMap";
	public $cms_live_scope = "live";
	public $cms_preview_scope = "preview";

	public $raw_stack = array(); //stack from waxurl
	public $cms_stack = array(); //stack of the url
	public $cms_content = false;

	public $previewing = false;

	public $cms_view = "";
	public $cms_default_view = "cms_view";
	public $cms_layout = "";
	public $cms_default_layout = "application";

	public $cms_action = "cms_page";

	//default action
	public function cms_page() {}

	/**
   *
	 */
	protected function cms(){
	  /**
	   * pagination check
	   */
		if($page = Request::get('page')) $this->this_page = $page;
		/**
		 * preview system, if its set then add the filter to the front end display and
		 * set the internal var & change the scope
		 */
		if(Request::get("preview")){
		  //this needs to be moved to an event
		  WaxTemplate::add_response_filter("layout", "cms-preview-bar", array("model"=>"CMSApplicationController","method"=>"add_preview_bar"));
		  $this->previewing = true;
		  $this->cms_live_scope = $this->cms_preview_scope;
	  }
		//method exists check
		if($this->is_public_method($this, Inflections::underscore($this->action)) ) return false;
		if(!$this->use_format) $this->use_format="html";
		//find the raw stack to check
		$this->raw_stack = WaxUrl::$params;
		//process the stack to remove some parts
		$this->cms_stack = $this->cms_stack($this->raw_stack);
		/**
		 * find the language
		 * - if we have more than 1 language, go looking for it
		 * - otherwise shift the first one off
		 */
		if(count(array_keys(CMSApplication::$languages)) > 1) $this->cms_language_id = $this->cms_language(Request::param($this->language_param), $this->cms_stack, CMSApplication::$languages);
		else $this->cms_language_id = array_shift(array_keys(CMSApplication::$languages));
	  /**
	   * use the modified stack to find content
	   * - try with the set language
	   * - if cant find it, look for default language version
	   */
	  if($content = $this->content($this->cms_stack, $this->cms_mapping_class, $this->cms_live_scope, $this->cms_language_id) ){
      $this->cms_content = $content;
    }elseif($content = $this->content($this->cms_stack, $this->cms_mapping_class, $this->cms_live_scope, array_shift(array_keys(CMSApplication::$languages)) )){
      $this->cms_content = $content;
	  }else throw new WXRoutingException('The page you are looking for is not available', "Page not found", '404');
    /**
     * find a matching view for the page, otherwise throw an error
     */
    if($this->cms_view = $this->cms_view($this->cms_stack, $this->cms_language_id)) $this->use_view = $this->cms_view;
    else throw new WXRoutingException("No view found", "Page not found", "404");
    /**
     * setup the layout
     */
    if($this->cms_layout = $this->cms_layout($this->cms_stack, $this->cms_language_id)) $this->use_layout = $this->cms_layout;
    else throw new WXRoutingException("No layout found", "Page not found", "404");
    /**
     * finally, set the action to the default cms one
     */
    $this->action = $this->cms_action;
	}
	/**
	 * go over the stack checking for applications that match, like view
	 */
	protected function cms_layout($stack, $language_id){
	  $accumulated = $base = "layouts/".$this->cms_default_layout;
	  $layouts = array($base);
	  //if the stack is empty, push home to it so has a custom view for home pages
	  if((count($stack) == 0)) $stack[] = "home";
	  //if there is one thing in the stack, and it is an allowed language, push that to the stack
	  else if(count($stack)==1 && ($key = array_shift(array_keys($stack))) && CMSApplication::$languages[$language_id] && CMSApplication::$languages[$language_id]['url'] == $stack[$key]) $stack[] = "home";
	  foreach($stack as $item){
	    $accumulated .= "_".$item;
	    $layouts[] = $base."_".$item;
	    $layouts[] = $accumulated;
	  }
	  $layouts = array_unique($layouts);
	  foreach(array_reverse($layouts) as $layout) if(is_readable(VIEW_DIR.$layout.".".$this->use_format)) return basename($layout);
	  return false;
	}
	/**
	 * from the stack and language id passed in, look for a suitable view
	 */
	protected function cms_view($stack, $language_id){
	  $accumulated = "";
	  $base = $this->controller ."/cms_%s%view";
	  $views = array($this->controller."/".$this->cms_default_view);
	  //if the stack is empty, push home to it so has a custom view for home pages
	  if((count($stack) == 0)) $stack[] = "home";
	  //if there is one thing in the stack, and it is an allowed language, push that to the stack
	  else if(count($stack)==1 && ($key = array_shift(array_keys($stack))) && CMSApplication::$languages[$language_id] && CMSApplication::$languages[$language_id]['url'] == $stack[$key]) $stack[] = "home";
	  foreach($stack as $item){
	    $accumulated .= $item."_";
	    $views[] = str_replace("%s%", $item."_", $base);
      $views[] = str_replace("%s%", $accumulated, $base);
	  }
	  $views = array_unique($views);
	  foreach(array_reverse($views) as $view) if($this->is_viewable($view, $this->use_format)) return $view;
	  return false;
	}
	/**
	 * use the cms_url_map to find a url that matches
   */
	protected function content($stack, $model_class, $model_scope, $language_id){
	  if(!$stack) $stack = array(); //if it doesnt, add in empty one
	  $permalink = "/".trim(implode("/", $stack), "/"). (count($stack)?"/":""); //keep the url consistant - start & end with a / - IT SHOULD CONTAIN LANGUAGE
	  $model = new $model_class($model_scope);
	  if($found = $model->filter("origin_url", $permalink)->filter("language", $language_id)->first() ) return $this->map_to_content($found);
	  return false;
	}
	/**
	 * split out what to do for a map object
	 */
	protected function map_to_content($map){
	  if($map->destination_url) $this->redirect_to($map->destination_url."?utm_source=".$map->origin_url."&utm_campaign=".$map->title."&utm_medium=Web Redirect", "http://", $map->header_status);
	  elseif(($model = $map->destination_model) && ($model_id = $map->destination_id) ) return new $model($model_id);
	}
	/**
	 * unset key elements from the stack (controller etc)
	 */
	protected function cms_stack($stack){
	  unset($stack['route'],$stack['controller'],$stack['action'],$stack['id'],$stack[0], $stack['page']);
		return $stack;
	}
	/**
	 * go over the url and look for possible languages from the languages array
	 * - returns an id to use as the language
	 */
	protected function cms_language($request_lang, $stack, $languages){
	  /**
	   * - if request_lang is present and is a key on the languages array, return that value
	   * - if its a word, then match it against each languages allowed urls
	   * - otherwise check the stack for a part that matches a languages url
	   * - all else fails, return the first language in the language array
	   */
	  if($request_lang && $languages[$request_lang]) return array($request_lang, $stack);
	  elseif(is_string($request_lang) ){
	    foreach($languages as $lang_id => $info) if($info['url'] == $request_lang) return $lang_id;
	  }else{
	    //stack
	    foreach($stack as $stack_pos => $url){
	      //compare this part of the stack to the languages
	      foreach($languages as $lang_id=>$info){
	        if($info['url'] == $url) return $lang_id;
	      }
      }
	  }
	  return array_shift(array_keys((array)$languages));
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
   * SHOW IMAGE - USED EVERYWHERE!
   */
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
   * FILE UPLOADER
   *
   */
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