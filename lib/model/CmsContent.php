<?php

class CmsContent extends WXActiveRecord {
  
  public $status_options = array("0"=>"Draft", "1"=>"Published"); //status 3 is used to signify a temp / autosaved page.
 	
 	public function after_setup() {
 	  $this->has_many("cms_file", "images");
 	  $this->has_many("cms_category", "categories");
 	}

 	public function page_status() {
 	  return $this->status_options[$this->status];
 	}

	public function sections() {
		$section = new CmsSection;
		return $section->find_ordered_sections();
	}
	
	public function section() {
		$section = new CmsSection;
		return $section->find($this->cms_section_id)->title;
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
	    if($res = $this->find_first($params)) return $res;
	  } 
	  
	  $params['conditions'].=" AND cms_section_id=$section";
	  if($res = $this->find_all($params)) return $res;
	  return array();
	}
	
	public function all_content($url, $section, $params=array()) {
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
  

  public function find_related_in_section($params) {
    $section = $this->cms_section_id;
    $find = "id !=".$this->id;
    if($params["conditions"]) $params["conditions"] .= " AND $find";
    else $params["conditions"] = $find;
    return $this->published_content("", $this->cms_section_id, $params);
  }
  
  public function author() {
    $user = new CmsUser;
    return $user->find($this->author_id);
  }
  
  public function author_options() {
    $user = new CmsUser;
    return options_from_collection($user->find_all(array("conditions"=>"usergroup > 9")), "id", "fullname");
  }
  
  /***** Finders for dealing with the extra_content table ******/
  
  public function extra_content($name) {
    $extra = new CmsExtraContent;
    if($result = $extra->find_by_name_and_cms_content_id($name, $this->id) ) {
      return $result;
    } else {
      $extra->setConstraint("cms_content_id", $this->id);
      return $extra;
    }
  }
    
  public function extra_content_value($name) {
    $extra = new CmsExtraContent;
    if($result = $extra->find_by_name_and_cms_content_id($name, $this->id) ) {
      return stripslashes($result->extra_content);
    } 
    return "";
  }
  
  public function find_with_extra_content($name, $params=array()) {
    $join=array("table"=>"cms_extra_content", "lhs"=>"id", "rhs"=>"cms_content_id");
    if($params["conditions"]) $params["conditions"].="AND name='$name' AND `extra_content` != ''";
    else $params["conditions"]= "name = '$name' AND `extra_content` !=''";
    return $this->find_all($params, $join);
  }
  
  public function save_extra_content() {
    $attributes = $_POST["cms_extra_content"];
    if($attributes) {
      foreach($attributes as $attribute=>$value) {
        $model = $this->extra_content($attribute);
        $model->cms_content_id = $this->id;
        $model->name = $attribute;
        $model->extra_content = $value;
        $model->save();
      }
    }
  }
  
  public function image($number) {
    return $this->images[$number-1];
  }
  
  public function add_pageview() {
    $this->pageviews = $this->pageviews + 1;
    $this->save();
  }
  
  
  public function format_content() {
    return CmsTextFilter::filter("before_output", $this->content);
  }
  /* delete bits form join table */
	public function remove_joins($information, $value){
		if(!is_array($information) || !$value) return false;
		$file_sql = 'DELETE FROM '. $information['file_table'] . ' WHERE `' . $information['file_field'] . "` = '$value'";
		$this->pdo->exec($sql);
		$sql = 'DELETE FROM '. $information['category_table'] . ' WHERE `' . $information['category_field'] . "` = '$value'";
		$this->pdo->exec($sql);
	}
	
	public function find_most_commented($section="1", $since="7", $limit="10") {
	  $content = new CmsContent;
	  $sections = new CmsSection;
	  if($section && !is_numeric($section)) $section = $sections->find_by_url($section)->id;
	  $sql = "SELECT *, count(attached_id) as counter FROM `cms_comment` RIGHT JOIN cms_content ON attached_id=cms_content.id WHERE cms_comment.status=1 AND `time` > date_sub(now(), INTERVAL '$since' DAY)";
	  if($section) $sql.= " AND cms_section_id=$section";
	  $sql.= " GROUP BY attached_id ORDER BY counter DESC LIMIT $limit";
	  return $content->find_by_sql($sql);
	}
	
	public function comments($params= array()) {
	  $comments = new CmsComment;
	  $params["conditions"]= "attached_id=".$this->id." AND attached_table='cms_content' AND status=1";
	  if(!$params["order"]) $params["order"] = "time ASC";
	  return $comments->find_all($params);
	}
	
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
    WHERE t2.id=t3.cms_category_id 
    AND t1.id=t3.cms_content_id
    AND t1.status=1 
    AND (DATE_FORMAT(t1.published, '%y%m%d') <=  DATE_FORMAT(NOW(),'%y%m%d'))";
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
      return $res[0];
    }
	}
	
	public function ping_technorati() {
	
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