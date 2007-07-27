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
    $this->get_templates($handle)
    return $this->body;
  }
  
  public function fetch_emails() {
    $email = new CmsSubscriber();
    return $email->find_all_by_status("1");
  }
  
  public function send_general_email($to_email, $to_name, $from_email, $from_name, $subject, $content, $unsubscribe) {
		$this->add_to_address($to_name. " <".$to_email.">" );
		$this->add_replyto_address($from_email, $from_name);
		$this->from = $from_email;
		$this->from_name = $from_name;
		$this->subject = $subject;
    $this->email_content = $content;
    $this->unsubscribe = $unsubscribe;
  }
  
  
  
  
}

?>