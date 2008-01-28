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
	  $this->author_id = Session::get('loggedin_user');
	  $this->avoid_section_url_clash();
	  $this->date_modified = date("Y-m-d H:i:s");
		if(!$this->date_created) $this->date_created = date("Y-m-d H:i:s");	
	  $this->content =  CmsTextFilter::filter("before_save", $this->content);
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
	public function date_expires(){
		if($this->expires > 0) return date('d/m/Y', strtotime($this->expires));
		else return false;
	}
	
	public function avoid_section_url_clash() {
	  $section = new CmsSection;
	  if($section->find_by_url($this->url)) $this->url= $this->url."-info";
	}
	
	public function published_content($url, $section, $params=array()) {
    $condition = "`status`=1 AND (DATE_FORMAT(`published`, '%y%m%d') <=  DATE_FORMAT(NOW(),'%y%m%d'))";
	  if($params['conditions']) $params['conditions'].=" AND ".$condition;
	  else $params['conditions'] = $condition;
	  if(!$params['order']) $params['order'] = "published DESC";
	  if(strlen($url)>0 && $res = $this->find_by_url_and_cms_section_id($url, $section, $params)) return $res;
	  if($this->is_section($url) && $res = $this->find_all_by_cms_section_id($section, $params)) return $res;
	  if($res = $this->find_all_by_cms_section_id($section, $params)) return $res;
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
}

?>