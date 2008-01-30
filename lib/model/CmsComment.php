<?php

class CmsComment extends WXActiveRecord {
  
	public $status_options = array("0"=>"Unapproved", "1"=>"Approved", "2"=>"Spam"); 
	

  public function validations() {
    $this->valid_required("author_name");
    $this->valid_required("author_email");
    $this->valid_format("author_email", "email");
  }
  
  
  public function before_create() {
    $this->author_ip = $_SERVER["REMOTE_ADDR"];
    $this->time = date("Y-m-d H:i:s");
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


}