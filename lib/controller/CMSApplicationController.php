<?php
/**
 * The main class thats used by the front end to access the
 * cms data, if data is found then this will also set up the actions,
 * views and content - how useful is that!
 * @package PHP-WAX CMS
 * @author charles marshall
 */

class CMSApplicationController extends WaxController{

  public $cms_called = false;
	public $per_page = 5;	//number of content items to list per page
	public $this_page = 1;	//the current page number

  public $language_param = "language";
	public $cms_language_id = false;

	public $cms_mapping_class = "WildfireUrlMap";
	public $cms_live_scope = "live";
	public $cms_preview_scope = "preview";
	public $cms_content_class = "WildfireContent";
  public $cms_category_class ="WildfireCategory";

	public $raw_stack = array(); //stack from waxurl
	public $cms_stack = array(); //stack of the url
	public $cms_content = false;

	public $cms_throw_missing_content = false;
  public $cms_throw_missing_view = false;

	public $previewing = false;

	public $cms_view = "";
	public $cms_default_view = "cms_view";
	public $cms_layout = "";
	public $cms_default_layout = "application";
  public $use_layout = "application";

	public $cms_action = "cms_page";

  public $body_class = "";
  public $body_id = "";
  public $content_object_stack = array();
  public $content_id_stack = array();
  public $top_level = false;
	//default action
	public function cms_page() {}

  protected function cms_stacks(){
    if($parent = $this->cms_content){
    	$path[] = $this->cms_content;
    	while($parent = $parent->parent) $path[] = $parent;

      $this->body_class = "";
		  foreach($path as $obj){
		    $content_object_stack[] = $obj;
		    $this->content_id_stack[] = $obj->primval;
		    $css = str_replace("/", "_", trim($obj->permalink, "/"));
		    $this->body_id = $css;
		    $this->body_class = $css . " ". $this->body_class;
	    }
		  $this->content_object_stack = array_reverse($content_object_stack);
		  $this->top_level = $this->content_object_stack[0];
		}else{
		  $this->body_class = $this->body_id = $this->controller."-".$this->action;
		}
  }

	/**
   *
	 */
	protected function cms(){
	  $this->event_setup();

	  $this->cms_called = true;
	  /**
	   * pagination check
	   */
		if($page = Request::get('page')) $this->this_page = $page;
		//method exists check
		if(WaxApplication::is_public_method($this, Inflections::underscore($this->action)) ) return false;
		/**
		 * preview system, if its set then add the filter to the front end display and
		 * set the internal var & change the scope
		 */
		if(Request::get("preview")){
		  WaxEvent::add("cms.preview_requested", function(){});
		  //this needs to be moved to an event
		  WaxTemplate::add_response_filter("layout", "cms-preview-bar", array("model"=>"CMSApplicationController","method"=>"add_preview_bar"));
		  $this->previewing = true;
		  $this->cms_live_scope = $this->cms_preview_scope;
	  }
		if(!$this->use_format) $this->use_format="html";
		WaxEvent::run("cms.use_format_set", $this);
		//find the raw stack to check
		$this->raw_stack = WaxUrl::$params;
		WaxEvent::run("cms.raw_stack_set", $this);
		//process the stack to remove some parts
		$this->cms_stack = $this->cms_stack($this->raw_stack);
		WaxEvent::run("cms.cms_stack_set", $this);
		/**
		 * find the language
		 * - if we have more than 1 language, go looking for it
		 * - otherwise shift the first one off
		 */
		if(count(array_keys(CMSApplication::$languages)) > 1) $this->cms_language_id = $this->cms_language(Request::param($this->language_param), $this->cms_stack, CMSApplication::$languages);
		else $this->cms_language_id = array_shift(array_keys(CMSApplication::$languages));
		WaxEvent::run("cms.cms_language_id_set", $this);

		//content look up event
	  WaxEvent::run("cms.content.lookup", $this);
	  if($this->cms_throw_missing_content) throw new WXRoutingException('The page you are looking for is not available', "Page not found", '404');
	  WaxEvent::run("cms.content.set", $this);
	  WaxEvent::run("cms.cms_content_set", $this);
    /**
     * find a matching view for the page, otherwise throw an error
     */
    WaxEvent::run("cms.view.lookup", $this);

    if($this->cms_throw_missing_view) throw new WXRoutingException("No view found", "Page not found", "404");
    /**
     * setup the layout
     */
    WaxEvent::run("cms.view.set", $this);

    /**
     * finally, set the action to the default cms one
     */
    $this->action = $this->cms_action;
    WaxEvent::run("cms.action_set", $this);
	}

	protected function event_setup(){
	  //look for cms content by calling functions etc
	  WaxEvent::add("cms.content.lookup", function(){
	    $obj = WaxEvent::data();
	    /**
  	   * use the modified stack to find content
  	   * - try with the set language
  	   * - if cant find it, look for default language version
  	   */
  	  if(($preview_id = Request::param('preview')) && is_numeric($preview_id) && ($m = new $obj->cms_content_class($preview_id)) && $m && $m->primval){
  	    $obj->cms_content = $m;
  	  }elseif($content = $obj->content($obj->cms_stack, $obj->cms_mapping_class, $obj->cms_live_scope, $obj->cms_language_id) ){
        $obj->cms_content = $content;
      }elseif($content = $obj->content($obj->cms_stack, $obj->cms_mapping_class, $obj->cms_live_scope, array_shift(array_keys(CMSApplication::$languages)) )){
        $obj->cms_content = $content;
      }elseif(WaxApplication::is_public_method($obj, "method_missing")){
        return $obj->method_missing();
  	  }else $obj->cms_throw_missing_content = true;
	  });

	  //look for views
	  WaxEvent::add("cms.view.lookup", function(){
	    $obj = WaxEvent::data();
	    if($obj->cms_view = $obj->cms_content->view) $obj->use_view = $obj->cms_view;
      elseif($obj->cms_view = $obj->cms_view($obj->cms_stack, $obj->cms_language_id)) $obj->use_view = $obj->cms_view;
      else $obj->cms_throw_missing_view = true;
	  });
    //set the views

	  WaxEvent::add("cms.view.set", function(){
	    $obj = WaxEvent::data();
	    if((!$obj->use_layout || $obj->use_layout == $obj->cms_default_layout) && $obj->cms_layout = $obj->cms_content->layout) $obj->use_layout = $obj->cms_layout;
      else if((!$obj->use_layout || $obj->use_layout == $obj->cms_default_layout) && $obj->cms_layout = $obj->cms_layout($obj->cms_stack, $obj->cms_language_id)) $obj->use_layout = $obj->cms_layout;
	  });

	}
	/**
	 * go over the stack checking for applications that match, like view
	 */
	public function cms_layout($stack, $language_id){
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
	public function cms_view($stack, $language_id){
	  $accumulated = "";
	  $base = $this->controller ."/cms_%s%view";
	  $views = array($this->controller."/".$this->cms_default_view, "shared/".$this->cms_default_view);
	  //if the stack is empty, push home to it so has a custom view for home pages
	  if((count($stack) == 0)) $stack[] = "home";
	  //if there is one thing in the stack, and it is an allowed language, push that to the stack
	  else if(count($stack)==1 && ($key = array_shift(array_keys($stack))) && CMSApplication::$languages[$language_id] && CMSApplication::$languages[$language_id]['url'] == $stack[$key]) $stack[] = "home";
	  foreach($stack as $item){
	    $accumulated .= $item."_";
	    $views[] = str_replace("%s%", $item."_", $base);
	    $views[] = str_replace($this->controller."/", "shared/", str_replace("%s%", $item."_", $base));
      $views[] = str_replace("%s%", $accumulated, $base);

      foreach((array)Autoloader::view_paths("plugin") as $path){
  	    $views[] = array('path'=>str_replace(PLUGIN_DIR, "", $path).str_replace($this->controller."/","shared/", str_replace("%s%", "", $base)), 'plugin'=>true);
  	    $views[] = array('path'=>str_replace(PLUGIN_DIR, "", $path).str_replace($this->controller."/","shared/", str_replace("%s%", $item."_", $base)), 'plugin'=>true);
  	    $views[] = array('path'=>str_replace(PLUGIN_DIR, "", $path).str_replace("%s%", $item."_", $base), 'plugin'=>true);
  	    $views[] = array('path'=>str_replace(PLUGIN_DIR, "", $path).str_replace("%s%", $accumulated, $base), 'plugin'=>true);
      }
	  }

	  foreach(array_reverse($views) as $view){
	    if(is_array($view) && $this->is_viewable($view['path'], $this->use_format, $view['plugin'])) return basename($view['path']);
	    else if(!is_array($view) && $this->is_viewable($view, $this->use_format)) return $view;
    }
	  return false;
	}
	/**
	 * use the cms_url_map to find a url that matches
   */

  public function content($stack, $model_class, $model_scope, $language_id){
    if(!$stack) $stack = array(); //if it doesnt, add in empty one
	  $permalink = "/".trim(implode("/", $stack), "/"). (count($stack)?"/":""); //keep the url consistant - start & end with a / - IT SHOULD CONTAIN LANGUAGE
    $model = new $model_class();
	  $model = $model->scope($model_scope);
	  $found = $model->filter("origin_url", $permalink)->filter("language", $language_id)->first();

	  if($found) return $this->map_to_content($found);
	  return false;
	}
	/**
	 * split out what to do for a map object
	 */
	public function map_to_content($map){
		if($map->destination_url && !$map->track_url) $this->redirect_to($map->destination_url);
	  elseif($map->destination_url) $this->redirect_to($map->destination_url."?utm_source=".$map->origin_url."&utm_campaign=".$map->utm_campaign."&utm_medium=".(($map->utm_medium)? $map->utm_medium : "Web Redirect") . $map->hash, "http://", $map->header_status);
	  elseif(($model = $map->destination_model) && ($model_id = $map->destination_id) ) return new $model($model_id);
	}
	/**
	 * unset key elements from the stack (controller etc)
	 */
	public function cms_stack($stack){
	  foreach($stack as $k=>$v) if(!is_numeric($k) || $v == $this->use_format) unset($stack[$k]);
	  unset($stack[0]);
    foreach($stack as $k=>$v){
      if(($split = explode("/", $v)) && count($split) > 1 && ($stack[$k] = array_shift($split)) ) foreach($split as $n) if($n) $stack[] = $n;
    }
		return $stack;
	}
	/**
	 * go over the url and look for possible languages from the languages array
	 * - returns an id to use as the language
	 */
	public function cms_language($request_lang, $stack, $languages){
	  /**
	   * - if request_lang is present and is a key on the languages array, return that value
	   * - if its a word, then match it against each languages allowed urls
	   * - otherwise check the stack for a part that matches a languages url
	   * - all else fails, return the first language in the language array
	   */
	  if($request_lang && $languages[$request_lang]) return $request_lang;
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
	  $preview_bar = partial("../shared/_preview_bar", $template, "html");
	  $buffer_contents = preg_replace("/(<\/head>)/",'<link type="text/css" href="/stylesheets/cms/preview-bar.css" rel="stylesheet" />$1', $buffer_contents);
	  $buffer_contents = preg_replace("/(<body.*?>)/","$1".$preview_bar, $buffer_contents);
	  return $buffer_contents;
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