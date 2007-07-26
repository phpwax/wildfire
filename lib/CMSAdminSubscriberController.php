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

	
	public function send_emails(){
		$modules = array_keys($this->model->handle_options());
		$this->model->handle = $modules[0];
		//get the data
		$this->email_content = $this->model->get_subscribed_content();
		$this->email_content = $this->email_content[$modules[0]];
		$this->title = $this->email_content['title'];
		$this->from = $this->model->get_from_email_name($this->model->handle) . " <".$this->model->get_from_email($this->model->handle).">";
		$this->footer = $this->model->email_footer($this->model->handle);
		unset($this->email_content['title']);
		$this->hcount = $this->model->count_of_handle($this->model->handle);
		//handle posted data
		$content 	= $_POST['email_content'];
		$subject 	= $_POST['subject'];
		$handle 	= $_POST['cms_subscriber']['handle'];
		if($content && $subject && $handle){
			$this->send($handle, $content, $subject);
			$this->use_view = "send";
		} elseif($_POST['submit']) {
			Session::add_message("Please complete all fields");
		}
		
	}
	private function send($handle, $content, $subject){
		if($recipents = $this->model->get_subscribers($handle)){		
			$this->successful = 0;
			$this->failed = 0;
			$from_email = $this->model->get_from_email($handle);
			$from_name = $this->model->get_from_email_name($handle);
			foreach($recipents as $recipent){
				$email = new WXEmail();
				$email->add_to_address($recipent->name. " <".$recipent->email.">" );
				$email->add_replyto_address($this->from_email, $this->from_name);
				$email->from = $from_email;
				$email->from_name = $from_name;
				$email->subject = $subject;
				$link = "http://".$_SERVER['HTTP_HOST']. "/subscribe/unsubscribe/".md5($recipent->email)."?handle=".$handle;
				$footer = str_ireplace("%UNSUBSCRIBE%", $link, $this->model->email_footer($handle));
				$email->body = $content . $footer;
				if($email->send()) $this->successful ++;
				else $this->failed ++;
			}
		} else {
			Session::add_message("No Subscribers Found for '" . WXInflections::humanize_undasherize($handle) . "'");
		}
	}
	
	public function ajax_populate_content(){
		//set the handle to the one selected
		$this->model->handle = $this->param("id");
		//get the data
		$this->email_content = $this->model->get_subscribed_content();
		$this->email_content = $this->email_content[$this->param("id")];
		$this->title = $this->email_content['title'];
		$this->footer = $this->model->email_footer($this->model->handle);
		unset($this->email_content['title']);
		$this->from = $this->model->get_from_email_name($this->model->handle) . " <".$this->model->get_from_email($this->model->handle).">";
		$this->hcount = $this->model->count_of_handle($this->model->handle);
		$this->use_layout = false;	
	}
	
	public function init_email($class, $handle) {
	  self::$registered_email_classes[$handle]=$class;
	}
	
	public function method_missing() {
	  $class = self::$registered_email_classes[$this->action];
	  $this->email_class = new $class;
	  $this->use_view="send_emails";
	  $this->email_content = $this->email_class->get_email_content();
	}
	
}
?>