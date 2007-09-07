<?php
class CMSAdminSubscriberController extends CMSAdminComponent{
  public $module_name = "subscriber";												
  public $model;
	public $model_class="CmsSubscriber";
	public $display_name = "Subscribers";
	public $scaffold_columns = array(
    "name"   	=> array(),
		"email" 	=> array(),
		"status"	=> array()
  );
	public $filter_columns = array("name", "email", "handle");
	static public $registered_email_classes = array();
	
	
	public function __construct(){
		parent::__construct();
		self::$registered_email_classes["general_emailer"]="CMSGeneralEmailer";
		foreach(self::$registered_email_classes as $handle=>$class) {
		  $this->sub_links[$handle] = "Send ".humanize($handle);
		}
		$this->link_partial = $this->render_partial("apply_links");
	}

	public function send_emails() {
	  $this->successful = 0;
		$this->failed = 0;
	  $class = self::$registered_email_classes[$_POST["email_handle"]];
	  $this->email_class = new $class;
		$content = new CmsContent();
	  if(strlen($_POST["test_emails"])>2 && strpos($_POST["test_emails"], " ")) $recipients = explode(" ", $_POST["test_emails"]);
	  elseif(strlen($_POST["test_emails"]) >2 && strpos($_POST["test_emails"], "\n")) $recipients = explode("\n", $_POST["test_emails"]);
	  elseif(strlen($_POST["test_emails"]) > 2) $recipients = array($_POST["test_emails"]);
	  else $recipients = $this->email_class->fetch_emails();
	  foreach($recipients as $recipient){
			$email = new $class;
			if($recipient instanceof CmsSubscriber) {
			 $to_email = $recipient->email; 
			 $to_name = $recipient->name; 
		  } else {
		    $to_email = $recipient; 
  			$to_name = $recipient;
		  }
			$unsubscribe = "http://".$_SERVER['HTTP_HOST']. "/subscribe/unsubscribe/".md5($recipent->email)."?handle=".$_POST["email_handle"];
			$method = "send_".$_POST["email_handle"];
			if($email->$method($to_email, $to_name, $_POST["from_email_address"], $_POST["from_name"], $_POST["email_subject"], $content->clean_html($_POST["email_content"]), $unsubscribe)) {
			  $this->successful ++; 
			} else $this->failed ++;
		}
		$this->use_view = "send";		
	}
	
	public function init_email($class, $handle) {
	  self::$registered_email_classes[$handle]=$class;
	}
	
	public function method_missing() {
	  $class = self::$registered_email_classes[$this->action];
	  $this->email_handle = $this->action;
	  $this->email_class = new $class;
	  $this->use_view="send_emails";
	  $this->email_content = $this->email_class->get_email_content($this->email_handle);
	  $this->email_subject = $this->email_class->email_subject;
	  $this->from_email = $this->email_class->from_email;
	  $this->from_name = $this->email_class->from_name;
	  $this->hcount = count($this->email_class->fetch_emails());
	}
	
}
?>