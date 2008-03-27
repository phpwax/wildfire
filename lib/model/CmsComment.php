<?php

class CmsComment extends WXActiveRecord {
  
	public $status_options = array("0"=>"Unapproved", "1"=>"Approved", "2"=>"Spam"); 
	public $config = array();
	public $attached_table_name = "cms_content";
	public $author_table_name = "cms_user";

  public function validations() {
    $this->valid_required("author_name");
    $this->valid_required("author_email");
    //$this->valid_format("author_email", "email");
    $this->valid_required("comment");
  }
  
  public function before_insert() {
    $this->author_ip = $_SERVER["REMOTE_ADDR"];
    $this->time = date("Y-m-d H:i:s");
    if(!$this->attached_table) $this->attached_table = $this->attached_table_name;
    if(!$this->author_table) $this->author_table = $this->author_table_name;
    $this->config = CmsConfiguration::get("comments");
    $this->flag_spam();
  }
  
  public function find_comments($article, $type=false) {
    if(!$type) $type = $this->attached_table_name;
    return $this->find_all(array("conditions"=>"attached_table='$type' AND attached_id=$article AND status=1", "order"=>"time ASC"));
  }
  
 
  public function time_ago() {
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
    $url .= "&default=http://".$_SERVER['HTTP_HOST']."/images/cms/default_avatar.gif";
    return $url;
  }
  
  protected function flag_spam() {
    $text = $this->comment;
    $total_matches = 0;
    $trash = array();
    // Count the regular links
    preg_match_all("/<a[^>]*>[^<]*<\/a>/", $text, $trash);
    $total_matches = count($trash[0]);

    // Check for common spam words
    if(strlen($user_blocks = $this->config["filter"]) > 1) $user_blocks = explode(" ", $user_blocks);
    else $user_blocks = array();
    $words = array_merge(array('phentermine', 'viagra', 'cialis', 'vioxx', 'oxycontin', 'levitra', 'ambien', 'xanax', "porn", "porno",
                   'paxil', 'casino', 'slot-machine', 'texas-holdem', "pussy", "buy", "online", "levitra", "\[url\=", "new\.txt"), $user_blocks );
    foreach ($words as $word) {
      $word_matches = preg_match_all('/' . $word . '/i', $text, $trash);
      if($word_matches >0) $total_matches +=$word_matches;
    }
    if(strlen($text > 1000)) $total_matches +=2;
    if(strlen($text < 13)) $total_matches +=2;
    if($total_matches > 4) $this->status="2";
    else $this->status="1";
  }
  
}