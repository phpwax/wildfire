<?php
interface CMSSubscription {
    
  public function get_email_content();
  public function email_content_options();
  
}



class CMSGeneralEmailer extends WXEmail implements CMSSubscription {
 
  public $content_options = array();
  
  
  public function __construct() {
    
  }
 
  public function get_email_content($handle) {
    
  }
  
  public function email_content_options() {
    return $this->content_options;
  }
  
  
}

?>