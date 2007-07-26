<?php
interface CMSSubscription {
    
  public function get_email_content();
  public function fetch_emails();
  
}



class CMSGeneralEmailer extends WXEmail implements CMSSubscription {
 
  public $content_options = array();
  
  
  
  public function __construct() {
    
  }
 
  public function get_email_content($handle) {
    return "";
  }
  
  public function fetch_emails() {
    $email = new CmsSubscriber();
    return $email->find_all_by_status("1");
  }
  
  
  
  
}

?>