<?php
interface CMSSubscription {
  
  public $from_email;
  public $from_name;
  public $email_subject;
    
  public function get_email_content($handle);
  public function fetch_emails();
  
}

?>