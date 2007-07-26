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
		
	}

	
	public function send_emails() {
	  $this->successful = 0;
		$this->failed = 0;
	  $class = self::$registered_email_classes[$_POST["email_handle"]];
	  $this->email_class = new $class;
	  if(strlen($_POST["test_emails"])>2) $recipients = explode(" ", $_POST["test_emails"]);
	  else $recipients = $this->email_class->fetch_emails();
	  foreach($recipients as $recipent){
			$email = new $class;
			$email->add_to_address($recipent->name. " <".$recipent->email.">" );
			$email->add_replyto_address($_POST["from_email_address"], $_POST["from_name"]);
			$email->from = $_POST["from_email_address"];
			$email->from_name = $_POST["from_name"];
			$email->subject = $_POST["subject"];
			$link = "http://".$_SERVER['HTTP_HOST']. "/subscribe/unsubscribe/".md5($recipent->email)."?handle=".$_POST["email_handle"];
			$footer = str_ireplace("%UNSUBSCRIBE%", $link, $this->email_class->email_footer);
			$email->body = $_POST["email_content"] . $footer;
			print_r($email); exit;
			if($email->send()) $this->successful ++;
			else $this->failed ++;
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
	  $this->email_footer = $this->email_class->email_footer;
	  $this->hcount = count($this->email_class->fetch_emails());
	}
	
}
?>