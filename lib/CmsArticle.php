<?php

class CmsArticle extends WXActiveRecord {
  
  public $status_options = array("0"=>"Draft", "1"=>"Published");
 	public $article_types = array('cms_article'=>'News', "cms_blog"=>'Press Release');
 	
 	public function after_setup() {
 	  $this->has_many("cms_file", "images");
 	}

 	public function page_status() {
 	  return $this->status_options[$this->status];
 	}
 	
	public function article_type_english(){
		return $this->article_types[$this->article_type];
	}

 	public function find_with_title($title) {
 	  $title = WXInflections::dasherize($title);
 	  return $this->find_by_title($title, array("options"=>"published = 1"));
 	}
}

?>