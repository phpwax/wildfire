<?php

class CmsComment extends WXActiveRecord {
  
	public $status_options = array("0"=>"Unapproved", "1"=>"Approved", "2"=>"Spam"); 
	public $config = array();

  public function validations() {
    $this->valid_required("author_name");
    $this->valid_required("author_email");
    $this->valid_format("author_email", "email");
    $this->valid_required("comment");
  }
  
  public function before_create() {
    $this->author_ip = $_SERVER["REMOTE_ADDR"];
    $this->time = date("Y-m-d H:i:s");
    if(!$this->attached_table) $this->attached_table = "cms_content";
    $this->config = CmsConfiguration::get("comments");
    $this->flag_spam();
  }
  
  function time_ago() {
    $ts = time() - strtotime(str_replace("-","/",$this->time));
    if($ts>31536000) $val = round($ts/31536000,0).' year';
    else if($ts>2419200) $val = round($ts/2419200,0).' month';
    else if($ts>604800) $val = round($ts/604800,0).' week';
    else if($ts>86400) $val = round($ts/86400,0).' day';
    else if($ts>3600) $val = round($ts/3600,0).' hour';
    else if($ts>60) $val = round($ts/60,0).' minute';
    else $val = $ts.' second';
    if($val>1) $val .= 's';
    return $val;
  }
  
  public function article_permalink() {
    $class= camelize($this->attached_table, true);
    $model = new $class;
    $article = $model->find($this->attached_id);
    return $article->permalink;
  }
  
  public function gravatar_url($size="50") {
    $url = "http://www.gravatar.com/avatar.php?";
    $url .= "gravatar_id=".md5(trim($this->author_email));
    $url .= "&size=$size";
    $url .= "&default=".$_SERVER['HTTP_HOST']."/images/cms/default_avatar.gif";
    return $url;
  }
  
  protected function flag_spam() {
    $total_matches = 0;
    $trash = array();
    // Count the regular links
    $total_matches += preg_match_all("/<a[^>]*>.*<\/a>/i", $text, $trash);
  
    // Check for common spam words
    $words = array_merge(array('phentermine', 'viagra', 'cialis', 'vioxx', 'oxycontin', 'levitra', 'ambien', 'xanax',
                   'paxil', 'casino', 'slot-machine', 'texas-holdem'), explode(" ", $this->config["filter"]) );
    foreach ($words as $word) {
      $word_matches = preg_match_all('/' . $word . '/i', $text, $trash);
      $total_matches += 5 * $word_matches;
    }
    if($total_matches > 4) $this->status="2";
    else $this->status="1";
  }


}