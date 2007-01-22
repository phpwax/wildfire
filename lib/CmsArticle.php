<?php

class CmsArticle extends WXActiveRecord {
  
  public $status_options = array("0"=>"Draft", "1"=>"Published");
 	public $article_types = array('cms_article'=>'Article', "cms_blog"=>'Blog');
 	
 	public function after_setup() {
 	  $this->has_many("cms_file", "images");
 	}

 	public function page_status() {
 	  return $this->status_options[$this->published];
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