<?php
interface CMSSubscription {
    
  public function get_email_content($handle);
  public function fetch_emails();
  
}



class CMSGeneralEmailer extends WXEmail implements CMSSubscription {
 
  public function get_email_content($handle) {
    $this->get_templates($handle);
    return $this->body;
  }
  
  public function fetch_emails() {
    $email = new CmsSubscriber();
    return $email->find_all_by_status("1");
  }
  
  public function general_emailer($to_email, $to_name, $from_email, $from_name, $subject, $content, $unsubscribe) {
		$this->add_to_address($to_email, $to_name);
		$this->add_replyto_address($from_email, $from_name);
		$this->from = $from_email;
		$this->from_name = $from_name;
		$this->subject = $subject;
    $this->email_content = $content;
    $this->unsubscribe = $unsubscribe;
  }
  
  public function get_templates($action) {
    $view = PLUGIN_DIR."cms/view/CMSGeneralEmailer/".$action;
    $html = $view.".html";
    $txt =  $view.".txt";
    if(is_readable($html && is_readable($txt))) {
      $this->is_html(true);
      $this->body=$this->view_to_string($view, $this);
      $this->alt_body = $this->view_to_string($view, $this, "txt");
    } elseif(is_readable($html)) {
      $this->is_html(true);
      $this->body=$this->view_to_string($view, $this);
    } elseif(!is_readable($html) && is_readable($txt)) {
      $this->body = $this->view_to_string($view, $this, "txt");
    }
  }
  
  public function view_to_string($view_path, $values=array(), $suffix="html") {
		$view= new WXTemplate($values);
		$view->add_path($view_path);
		return $view->parse($suffix);
	}
  
  
}

?>