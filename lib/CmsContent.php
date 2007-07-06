<?php

class CmsContent extends WXActiveRecord {
  
  public $status_options = array("0"=>"Draft", "1"=>"Published");
 	
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
	  $this->content = $this->clean_html($this->content);
	}
	
	public function permalink() {
	  $section = new CmsSection($this->cms_section_id);
	  return $section->permalink()."/".$this->url;
	}
	
	public function date_published(){
			return date('D jS M y', strtotime($this->published));
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
  
  public function clean_html($text) {
    // remove escape slashes
    $text = stripslashes($text);
  
    // strip tags, still leaving attributes, second variable is allowable tags
    $text = strip_tags($text, '<p><strong><em><u><a><h1><h2><h3><h4><h4><h5><h6><blockquote>');
    // removes the attributes for allowed tags
    $text = preg_replace("/<(p|strong|em|u|h1|h2|h3|h4|h5|h6)([^>]*)>/", "<$1>", $text);
    return $this->convert_word($text);
  }
  
  public function convert_word($text) {
    $find[] = '“';  // left side double smart quote
    $find[] = '”';  // right side double smart quote
    $find[] = '‘';  // left side single smart quote
    $find[] = '’';  // right side single smart quote
    $find[] = 'â€¦';  // elipsis
    $find[] = '—';  // em dash
    $find[] = '—';  // en dash
    
    $replace[] = '"';
    $replace[] = '"';
    $replace[] = "'";
    $replace[] = "'";
    $replace[] = "...";
    $replace[] = "-";
    $replace[] = "-";
    return str_replace($find, $replace, $text);
  }  
	
}

?>