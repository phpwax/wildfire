<?php

class CmsComment extends WXActiveRecord {
  
	public $status_options = array("0"=>"Unapproved", "1"=>"Approved", "2"=>"Spam"); 
	

  public function validations() {
    $this->valid_required("author_name");
    $this->valid_required("author_email");
    $this->valid_format("author_email", "email");
  }
  
  
  public function before_save() {
    $this->author_ip = $_SERVER["REMOTE_ADDR"];
  }


}