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
    return $this->debug($text);
  }
  
  public function convert_smart_quotes($string) {
    //converts smart quotes to normal quotes.
    $search = array(chr(145), chr(146), chr(147), chr(148), chr(151));
    $replace = array("'", "'", '"', '"', '-');
    return str_replace($search, $replace, $string);
  }
  
  public function debug($text) {
    for($i = 0; $i < strlen($text); $i++) {
      $num = $this->uniord($text{$i});
      echo $text{$i}.": ".$num."<br />";
    }
    exit;
  }
  
  public function uniord($c) {
    $ud = 0;
    if (ord($c{0})>=0 && ord($c{0})<=127)
     $ud = ord($c{0});
    if (ord($c{0})>=192 && ord($c{0})<=223)
     $ud = (ord($c{0})-192)*64 + (ord($c{1})-128);
    if (ord($c{0})>=224 && ord($c{0})<=239)
     $ud = (ord($c{0})-224)*4096 + (ord($c{1})-128)*64 + (ord($c{2})-128);
    if (ord($c{0})>=240 && ord($c{0})<=247)
     $ud = (ord($c{0})-240)*262144 + (ord($c{1})-128)*4096 + (ord($c{2})-128)*64 + (ord($c{3})-128);
    if (ord($c{0})>=248 && ord($c{0})<=251)
     $ud = (ord($c{0})-248)*16777216 + (ord($c{1})-128)*262144 + (ord($c{2})-128)*4096 + (ord($c{3})-128)*64 + (ord($c{4})-128);
    if (ord($c{0})>=252 && ord($c{0})<=253)
     $ud = (ord($c{0})-252)*1073741824 + (ord($c{1})-128)*16777216 + (ord($c{2})-128)*262144 + (ord($c{3})-128)*4096 + (ord($c{4})-128)*64 + (ord($c{5})-128);
    if (ord($c{0})>=254 && ord($c{0})<=255) //error
     $ud = false;
   return $ud;
  }
	
}

?>