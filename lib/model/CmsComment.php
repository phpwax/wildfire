<?php
/**
 * cms comments
 */

class CmsComment extends WaxModel {
  
  
	public $status_options = array("0"=>"Unapproved", "1"=>"Approved", "2"=>"Spam"); 
	public $config = array();
	
	public function setup(){
		$this->define("attached_to", "ForeignKey", array('target_model'=>"CmsContent", 'col_name'=>"attached_id", 'editable'=>false) );
		$this->define("author_name", "CharField", array('maxlength'=>255, "required"=>true, 'blank'=>false));
		$this->define("author_email", "CharField", array('maxlength'=>255, "required"=>true, 'blank'=>false));
		$this->define("author_website", "CharField", array('maxlength'=>255));	
		$this->define("comment", "TextField");					
		$this->define("author_ip", "CharField", array('maxlength'=>255, 'editable'=>false));				
		$this->define("author", "ForeignKey", array('target_model'=>"WildfireUser",'editable'=>false));				
		$this->define("status", "IntegerField", array('maxlength'=>2,'editable'=>false));
		$this->define("type", "CharField", array('maxlength'=>255,'editable'=>false));		
		$this->define("karma", "CharField", array('maxlength'=>128,'editable'=>false));		
		$this->define("time", "DateTimeField",array('editable'=>false));				
	}
	
  public function validations() {
    $this->valid_required("author_name");
    $this->valid_required("author_email");
    $this->valid_required("comment");
  }
  
  public function before_insert() {
    $this->author_ip = $_SERVER["REMOTE_ADDR"];
    $this->time = date("Y-m-d H:i:s");
    $this->config = CmsConfiguration::get("comments");
    $this->flag_spam();
  }
	
  public function article() {
    return $this->attached_to;
  }
  
  public function scope_filtered() {
    $this->filter(array("status"=>1));
    $this->order("id DESC");
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
    return $$this->attached_to->permalink;
  }
  
  public function gravatar_url($size="50") {
    $url = "http://www.gravatar.com/avatar/";
    $url .= md5(trim($this->author_email));
    $url .= "?s=$size";
    $url .= "&default=http://".$_SERVER['HTTP_HOST']."/images/cms/default_avatar.gif";
    return $url;
  }
  
  public function clean_comment() {
    return stripslashes(strip_tags($this->comment, "<a><img>"));
  }
  
  protected function flag_spam() {
    $text = $this->comment;
    $total_matches = 0;
    $trash = array();
    // Count the regular links
    preg_match_all("/<a[^>]*>[^<]*<\/a>/i", $text, $trash);
    $total_matches = count($trash[0]);

    // Check for common spam words
    if(strlen($user_blocks = $this->config["filter"]) > 1) $user_blocks = explode(" ", $user_blocks);
    else $user_blocks = array();
    $words = array_merge(array('phentermine', 'viagra', 'cialis', 'vioxx', 'oxycontin', 'levitra', 'ambien', 'xanax', "porn", "porno",
                   'paxil', 'casino', 'slot-machine', 'texas-holdem', "pussy", "buy", "online", "levitra", "[url=", "new.txt", 'anal'), $user_blocks );
    foreach ($words as $word) {
      $word_matches = preg_match_all('/' . preg_quote($word) . '/i', $text, $trash);
      if($word_matches >0) $total_matches +=($word_matches *2);
    }
		$word_count = count(explode(" ", $text));
		$http_count = count(explode("http", $text));
		if($word_count < 2) $total_matches += 4;
		if($http_count > 0) $total_matches += $http_count;		
    if(strlen($this->author_name) > 20) $total_matches +=4;
    if(strlen($text > 1000)) $total_matches +=2;
    if(strlen($text < 13)) $total_matches +=2;
    if($total_matches >= 4) $this->status="2";
    elseif(!$this->status) $this->status="1";
  }
  
	/*************** OLD FUNCTIONS - TO BE REMOVED - SOME ALREADY RETURN FALSE ********************/
	/*old, cant see it used anywhere so will get it to return false*/
  public function find_comments($article=false, $type=false) {
		return false;
  }
	
}