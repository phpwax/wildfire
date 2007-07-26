<?php
interface CMSSubscription {
    
  public function get_email_content($handle);
  public function fetch_emails();
  
}



class CMSGeneralEmailer extends WXEmail implements CMSSubscription {
 
  public $content_options = array();
  public $email_footer = "\n\n----------------\nFollow this link to unsubscribe %UNSUBSCRIBE%\n\n";
  
  
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