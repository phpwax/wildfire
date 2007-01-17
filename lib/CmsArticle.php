<?php

class CmsArticle extends WXActiveRecord {
  
  public $status_options = array("0"=>"draft", "1"=>"published");
 	public $article_types = array('cms_article'=>'Article', "cms_blog"=>'Blog');

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