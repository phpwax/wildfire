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
  
  public function clean_html($text) {
    // remove escape slashes
    $text = stripslashes($text);
  
    // strip tags, still leaving attributes, second variable is allowable tags
    $text = strip_tags($text, '<p><strong><em><a><h1><h2><h3><h4><h4><h5><h6><blockquote><ul><ol><li><span>');
    // removes the attributes for allowed tags
    $text = preg_replace("/<(p|h1|h2|h3|h4|h5|h6|ul|ol|li|span)([^>]*)>/", "<$1>", $text);
    return $this->convert_word($text);
  }
  
  public function convert_word($text) {
    
    $search = array(chr(0xe2) . chr(0x80) . chr(0x98),
                      chr(0xe2) . chr(0x80) . chr(0x99),
                      chr(0xe2) . chr(0x80) . chr(0x9c),
                      chr(0xe2) . chr(0x80) . chr(0x9d),
                      chr(0xe2) . chr(0x80) . chr(0x93),
                      chr(0xe2) . chr(0x80) . chr(0x94),
                      chr(0xe2) . chr(0x80) . chr(0xa6),
											chr(194) );

      $replace = array("'",
                       "'",
                       '"',
                       '"',
                       '&ndash;',
                       '&mdash;',
                       "...");

    return str_replace($search, $replace, $text);
  }
  
  
  public function format_content() {
    $text = $this->content;
    $text = preg_replace("/<p>/", "<p class='first_para'>", $text, 1);
    $text = preg_replace("/\.{4,}/", "<hr />", $text);
    $widont_finder = "/(\s+)                    # the space to replace
      ([^<>\s]+                                 # must be flollowed by non-tag non-space characters
      \s*                                       # optional white space! 
      (<\/(a|em|span|strong|i|b)[^>]*>\s*)*     # optional closing inline tags with optional white space after each
      (<\/(p|h[1-6]|li)|$))                     # end with a closing p, h1-6, li or the end of the string
      /x";

     $text = preg_replace($widont_finder, '&nbsp;\\2', $text);
     $amp_finder = "/(\s|&nbsp;)(&|&amp;|&\#38;)(\s|&nbsp;)/";
     $text = preg_replace($amp_finder, '\\1<span class="amp">&amp;</span>\\3', $text);
     return $text;
  }
  
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
      return $result->content;
    } 
    return "";
  }
  
  public function save_extra_content() {
    $attributes = $_POST["cms_extra_content"];
    if($attributes) {
      foreach($attributes as $attribute=>$value) {
        $model = $this->extra_content($attribute);
        $model->cms_content_id = $this->id;
        $model->name = $attribute;
        $model->content = $value;
        $model->save();
      }
    }
  }
  
  public function image($number) {
    $images = $this->images;
    print_r($images); exit;
    return $images[$number];
  }
  
	
}

?>