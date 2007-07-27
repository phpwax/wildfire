<?php
interface CMSSubscription {
    
  public function get_email_content($handle);
  public function fetch_emails();
  
}

?>