<?php

class CmsContent extends WaxModel {
  public $status_options = array("0"=>"Draft", "1"=>"Published");

	public function setup(){
		$this->define("title", "CharField", array('maxlength'=>255) );
		$this->define("excerpt", "TextField");
		$this->define("content", "TextField");
		$this->define("status", "IntegerField", array('maxlength'=>2));
		$this->define("published", "DateTimeField");
		$this->define("expires", "DateTimeField");
		$this->define("date_modified", "DateTimeField");
		$this->define("date_created", "DateTimeField");
		$this->define("sort", "IntegerField", array('maxlength'=>3));
		$this->define("pageviews", "IntegerField", array('maxlength'=>5));
		$this->define("url", "CharField", array('maxlength'=>255,"unique"=>true));
		//used in conversion
		$this->define("oldid", "IntegerField");
		//images
		$this->define("images", "ManyToManyField", array('target_model'=>"WildfireFile", 'editable'=>false));
		//section
		$this->define("section", "ForeignKey", array('target_model'=>'CmsSection','editable'=>false));
		//author
		$this->define("author", "ForeignKey", array('target_model'=>'WildfireUser', 'col_name'=>"author_id",'editable'=>false));
		//more_content <-> content
		$this->define("more_content", "HasManyField", array('target_model'=>"CmsExtraContent", 'join_field'=>"cms_content_id",'editable'=>false));
		//comments <-> attached_to
		$this->define("comments", "HasManyField", array('target_model'=>"CmsComment", 'join_field'=>"attached_id",'editable'=>false));
		//category <-> attached_to
		$this->define("categories", "ManyToManyField", array('target_model'=>"CmsCategory",'editable'=>false));
	}
	public function page_status() {
		return $this->status_options[$this->status];
	}
	public function sections() {
		$section = new CmsSection;
		return $section->find_ordered_sections();
	}
	public function section_name() {
		return $this->section->title;
	}

	public function before_save() {
	  $this->date_modified = date("Y-m-d H:i:s");
		if(!$this->date_created) $this->date_created = date("Y-m-d H:i:s");
	  $this->content =  CmsTextFilter::filter("before_save", $this->content);
	  if($this->id) {
	    $old_model = new CmsContent($this->id);
	    if($old_model->status < $this->status) $this->before_publish();
	  }
	  if(!$this->is_published() || is_numeric($this->url)) {
	    $this->generate_url();
	  }
	}
	public function before_insert() {

	}
	
	public function generate_url() {
	  if(!$this->title) return false;
	  $this->url = WXInflections::to_url($this->title);
  	$this->avoid_section_url_clash();
	}
	
	
	public function after_save() {
		$this->save_extra_content();
	}
	
	public function before_publish() {
	  $this->generate_url();
  	$this->ping_technorati();
  	if(strtotime($this->published) < time()) {
  	  $this->published = date("Y-m-d H:i:s");
  	}
	}
	
	public function permalink() {
	  $section = new CmsSection($this->cms_section_id);
		return $section->permalink()."/".$this->url;
	}
	public function date_published(){
		return date('d/m/Y', strtotime($this->published));
	}
	public function is_published() {
		if($this->status=="1" && strtotime($this->published) < time() ) return true;
		return false;
	}
	public function date_expires(){
		if($this->expires > 0) return date('d/m/Y', strtotime($this->expires));
		else return false;
	}
	public function avoid_section_url_clash() {
	  $section = new CmsSection;
	  if($section->filter(array('url'=>$this->url))->first() ) $this->url= $this->url."-info";
	}
	
	public function find_related_in_section($params=false) {
		return $this->clear()->filter('cms_section_id='.$this->cms_section_id . " id <> ".$this->id)->order('published DESC')->all();
  }
	public function author() {
		$this->author->username;
  }
  public function by() {
    return $this->author->fullname;
  }
	public function author_options() {
		$user = new WildfireUser;
		return options_from_collection($user->filter('usergroup > 9')->all(), "id", "fullname");
  }
  /***** Finders for dealing with the extra_content table ******/
	public function extra_content($name) {
		$content = $this->more_content;
		if($content->count() > 0 && $content->filter(array('name'=>$name))->all()->count() > 0) return $content->first();
		else{
			$extra = new CmsExtraContent;
			$extra->setConstraint("cms_content_id", $this->id);
			return $extra;
		}
		
  }
	public function extra_content_value($name) {
		$content = $this->more_content;
		if($content) return CmsTextFilter::filter("before_output", $content->filter(array('name'=>$name))->first()->extra_content);
		else return "";
  }
	
	public function save_extra_content() {
		$attributes = $_POST["cms_extra_content"];
		if(count($attributes)){
			foreach($attributes as $name=>$value){
				if($value){
					$model = $this->extra_content($name);
					$model->name = $name;
					$model->extra_content = $value;
					$this->more_content = $model;
				}
			}
		}
  }

	public function image($number) {
	  $images = $this->images;
	  if($images->count()) return $images[$number-1];
	  return false;
	}
	public function add_pageview() {
		$this->pageviews = intval($this->pageviews) + 1;
		$this->save();
  }
	public function format_content() {
    return CmsTextFilter::filter("before_output", $this->content);
  }
  
  public function scope_published() {
    $this->filter(array("status"=>"1"));
    $this->filter("(DATE_FORMAT(`published`, '%y%m%d%H%i') <=  DATE_FORMAT(NOW(),'%y%m%d%H%i'))");
    $this->order("UNIX_TIMESTAMP(published) DESC");
  }

	/*************** OLD FUNCTIONS - TO BE REMOVED - SOME ALREADY RETURN FALSE ********************/
	/*not sure if or where this is used - cant seem to find it so now returns false*/
	public function find_with_extra_content($name, $params=array()) {
		return false;
  }
	public function is_section($url) {
		$section = new CmsSection;
    if($section->filter(array('url'=>$url))->first()) return true;
    return false;
  }
	//these will be replaced by 'scoping'
	public function published_content($url, $section, $params=array()) {
		return array();
		/*
		$condition = "`status`=1 AND (DATE_FORMAT(`published`, '%y%m%d%H%i') <=  DATE_FORMAT(NOW(),'%y%m%d%H%i'))";
	  if($params['conditions']) $params['conditions'].=" AND ".$condition;
	  else $params['conditions'] = $condition;
	  if(!$params['order']) $params['order'] = "UNIX_TIMESTAMP(published) DESC";
	  if($this->is_section($url)) {
	    $params['conditions'].=" AND cms_section_id=$section";
	    if($res = $this->find_all($params)) return $res;
	  }
	  if(is_array($section)) {
	    $params["conditions"].=" AND cms_section_id IN(".implode(",",$section).")";
	    return $this->find_all($params);
	  }
	  if(strlen($url)>0) {
	    $params['conditions'].=" AND url='$url' AND cms_section_id=$section";
	    if($res = $this->find($params)) return $res;
	  }
	  $params['conditions'].=" AND cms_section_id=$section";
	  if($res = $this->find_all($params)) return $res;
	
	  return array();
		*/
	}
	public function all_content($url, $section, $params=false) {
		return array();
		/*
		if(!$params['order']) $params['order'] = "published DESC";
	  if(strlen($url)>1 && $res = $this->find_by_url_and_cms_section_id($url, $section, $params)) return $res;
	  if($this->is_section($url) && $res = $this->find_all_by_cms_section_id($section, $params)) return $res;
	  return array();
		*/
  }

  /* delete bits form join table -now handled by the field */
	public function remove_joins($information, $value){return true;}
	/* old version */
	public function find_most_commented($section="1", $since="7", $limit="10") {
		
		$content = new CmsContent;
		$sections = new CmsSection;
	  if($section && !is_numeric($section)) $section = $sections->filter(array('url'=>$section))->first()->id;
	  $sql = "SELECT *, count(attached_id) as counter FROM `cms_comment` RIGHT JOIN cms_content ON attached_id=cms_content.id WHERE cms_comment.status=1 AND `time` > date_sub(now(), INTERVAL '$since' DAY)";
	  if($section) $sql.= " AND cms_section_id=$section";
	  $sql.= " GROUP BY attached_id ORDER BY counter DESC LIMIT $limit";
	  return $content->find_by_sql($sql);
	  
	}
	public function fuzzy_category_find($searches = array(), $limit="1", $section=false) {
	  return false;
	}
	//this should now be handled by a category model
	public function find_by_category($category, $limit="1", $section=false) {
		return false;
	}
	
	public function ping_technorati(){
		# Using the XML-RPC extension to format the XML package
		$request = '<?xml version="1.0"?>
      <methodCall>
        <methodName>weblogUpdates.ping</methodName>
        <params>
          <param>
            <value>http://'.$_SERVER["HTTP_HOST"].'</value>
          </param>
          <param>
            <value>http://'.$_SERVER["HTTP_HOST"].'</value>
          </param>
        </params>
      </methodCall>
    ';
		# Using the cURL extension to send it off,
		# first creating a custom header block
    $header[] = "Host: rpc.technorati.com";
    $header[] = "Content-type: text/xml";
    $header[] = "Content-length: ".strlen($request) . "\r\n";
    $header[] = $request;
    $ch = curl_init();
    curl_setopt( $ch, CURLOPT_URL, "http://rpc.technorati.com/rpc/ping"); # URL to post to
    curl_setopt( $ch, CURLOPT_RETURNTRANSFER, 1 ); # return into a variable
    curl_setopt( $ch, CURLOPT_HTTPHEADER, $header ); # custom headers, see above
    curl_setopt( $ch, CURLOPT_CUSTOMREQUEST, 'POST' ); # This POST is special, and uses its specified Content-type
    $result = curl_exec( $ch ); # run!
    curl_close($ch);
	}	
	
}

?>
