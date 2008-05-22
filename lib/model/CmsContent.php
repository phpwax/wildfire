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
		//old copy over fields
		$this->define("oldid", "IntegerField");
		//joins
		//images
		$this->define("images", "ManyToManyField", array('model_name'=>"WildfireFile"));
		//section
		$this->define("section", "ForeignKey", array('model_name'=>'CmsSection'));
		//author
		$this->define("author", "ForeignKey", array('model_name'=>'WildfireUser', 'col_name'=>"author_id"));
		//extra content
		$this->define("more_content", "HasManyField", array('model_name'=>"CmsExtraContent", 'join_field'=>"cms_content_id"));
		//comments
		$this->define("comments", "HasManyField", array('model_name'=>"CmsComments", 'join_field'=>"attached_id"));
		//categorys
		$this->define("categories", "ManyToManyField", array('model_name'=>"CmsCategory"));
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
	  $this->url = WXInflections::to_url($this->title);
	  $this->avoid_section_url_clash();
	  $this->date_modified = date("Y-m-d H:i:s");
		if(!$this->date_created) $this->date_created = date("Y-m-d H:i:s");
	  $this->content =  CmsTextFilter::filter("before_save", $this->content);
	}
	public function before_insert() {
		$this->author_id = Session::get('loggedin_user');
	}
	public function after_insert() {
		if($this->is_published()) $this->ping_technorati();
	}
	public function after_save() {
		$this->save_extra_content();
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
	  if($section->find_by_url($this->url)) $this->url= $this->url."-info";
	}
	public function published_content($url, $section, $params=array()) {
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
	}
	public function all_content($url, $section, $params=false) {
		if(!$params['order']) $params['order'] = "published DESC";
	  if(strlen($url)>1 && $res = $this->find_by_url_and_cms_section_id($url, $section, $params)) return $res;
	  if($this->is_section($url) && $res = $this->find_all_by_cms_section_id($section, $params)) return $res;
	  return array();
  }
	public function is_section($url) {
		$section = new CmsSection;
    if($section->find_by_url($url)) return true;
    return false;
  }
	public function find_related_in_section($params=false) {
		return $this->clear()->filter('cms_section_id='.$this->cms_section_id . " id <> ".$this->id)->order('published DESC')->all();
    /* old version, left in as this function doesnt seem to be used at the mo.
		$section = $this->cms_section_id;
    $find = "id !=".$this->id;
    if($params["conditions"]) $params["conditions"] .= " AND $find";
    else $params["conditions"] = $find;
    return $this->published_content("", $this->cms_section_id, $params);*/
  }
	public function author() {
		$this->author->username;
  }
  public function by() {
    return $this->author->username;
  }
	public function author_options() {
		$user = new WildfireUser;
		return options_from_collection($user->filter('usergroup > 9')->all(), "id", "fullname");
  }
  /***** Finders for dealing with the extra_content table ******/
	public function extra_content($name) {
		$content = $this->more_content;
		if($content){
			return $content->filter(array('name'=>$name))->first();
		}else{
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
	/*not sure if or where this is used - cant seem to find it so now returns false*/
	public function find_with_extra_content($name, $params=array()) {
		return false;
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
		return $this->images[$number-1];
	}
	public function add_pageview() {
	  echo $this->pageviews."....";
		$this->pageviews = intval($this->pageviews) + 1;
		$this->save();
	  echo $this->pageviews."....";
	  exit;
  }
	public function format_content() {
    return CmsTextFilter::filter("before_output", $this->content);
  }
  /* delete bits form join table -now handled by the field */
	public function remove_joins($information, $value){return true;}

	public function fuzzy_category_find($searches = array(), $limit="1", $section=false) {
	  foreach($searches as $search) {
	    $conditions = "";
	    $search_words = preg_split("/[\s-]/",$search);
      foreach($search_words as $word) $conditions .= "name LIKE '%$word%' AND ";
      $conditions = rtrim($conditions, " AND");
      $queries[]=$conditions;
	  }
		$query = "(";
	  $query.=join($queries, ") OR (");
	  $query.=")";
	  $cat = new CmsCategory;
    $res = $cat->find_all(array("conditions"=>$query));
    foreach($res as $category) $cat_ids[]=$category->id;
    return $this->find_by_category($cat_ids, $limit, $section);
	}
	public function find_by_category($category, $limit="1", $section=false) {
		$sql="SELECT t1.* FROM `cms_content` as t1, cms_category as t2, cms_category_cms_content as t3
    WHERE t2.id=t3.cms_category_id AND t1.id=t3.cms_content_id AND t1.status=1 AND (DATE_FORMAT(t1.published, '%y%m%d') <=  DATE_FORMAT(NOW(),'%y%m%d'))";
    if(is_array($category)) {
      $sql.=" AND t2.id IN(".join(",", $category).")";
    } else $sql.= " AND t2.id=$category";
    if(is_array($section)) {
      $sql.=" AND t1.cms_section_id IN(".join(",", $section).")";
    } elseif($section) $sql.= " AND t1.cms_section_id=$section";
    $sql.= " ORDER BY t1.published DESC LIMIT $limit";
    if($limit > 1) return $this->find_by_sql($sql);
    else {
			$res = $this->find_by_sql($sql);
      return $res->first();
		}
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
    error_log($result);
	}	
	
}

?>
