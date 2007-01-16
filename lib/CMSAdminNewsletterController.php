<?php
/**
* Class giving an admin interface to manipulate subscribers
* @package CMSPlugin
* @author WebXpress
* @version 1.0
*/

class CMSEmail extends WXEmail{
	public function clear_to_address(){
		$this->to = array();
	}
}

class CMSAdminNewsletterController extends CMSAdminComponent {
	public $model;
	public $model_class="CmsSubscriber";
	public $model_name = "cms_subscriber";	
	public $display_name = "Newsletter";
	public $from_address = "newsletter@webxpress.com";
	
	function __construct(){
		parent::__construct();
		$this->sub_links = array();
		$this->sub_links["index"] = $this->display_name." Home";
		$this->sub_links["list_subscribers"] = "List Subscribers";
		$this->sub_links["create"] = "Create Subscriber";
		$this->sub_links["manage_newsletters"] = "List Newsletters";
		$this->sub_links["create_newsletter"] = "Create Newsletter";
		$this->sub_links["config"] = "Config";
		$this->cms_template_dir = PLUGIN_DIR . "{$this->use_plugin}/view/newslettertemplates/";
		$this->app_template_dir = VIEW_DIR . "newslettertemplates/";
	}
	
	public function index(){
		$this->display_action_name = 'Overview';
		$newsletter_model = new CmsNewsletter();
		$this->newsletters = $newsletter_model->find_all(array('limit'=>10));
		$newsletter_send_model = new CmsNewsletterSend;
		$this->send_results = $newsletter_send_model->find_all(array('limit'=>10));
		$subscribers_model = new CmsSubscriber();
		$this->subscribers = $subscribers_model->find_all(array('limit'=>10));
	}
	
	public function list_subscribers(){
			$this->display_action_name = 'List Items';
		  $options = array("order"=>$this->default_order." ".$this->default_direction);
			$this->all_rows = $this->model->paginate($this->list_limit, $options);
			if(!$this->all_rows) $this->all_rows=array();
			$this->list = $this->render_partial("list");
	}
	
	// used to edit subscriber
	public function create() {
		$tag_model = new CmsTag;
	  $this->tags = $tag_model->find_all();
		parent::create();
	}
	
	// used to edit subscriber
	public function edit() {
		$tag_model = new CmsTag;
	  $this->tags = $tag_model->find_all();
		parent::edit();
	}
	
	public function config(){
		print 'Auto send latest email on registration?<br />';
		print 'Allow duplicate emails?<br />';
		exit;
	}
	
	public function create_newsletter(){
		Session::unset_var('email');
		Session::unset_var('group');
		// lists templates - overwrites any cmscore templates with those in the app
		$cms_templates = glob($this->cms_template_dir."*.html");
		$app_templates = glob($this->app_template_dir."*.html");
		$templates = array_merge($cms_templates,$app_templates);
		
		$this->templates = array();
		$this->templates[] = 'Plain Text';
		foreach($templates as $template){
			$template_filename = pathinfo($template,PATHINFO_BASENAME);
			$this->templates[$template_filename] = $template_filename;
		}
	}
	
	public function preview_newsletter(){		
		$template = self::get_full_template_path($_POST['cms_subscriber']['template']);
		$this->email = self::render_email(file_get_contents($template),$_POST['cms_subscriber']['content']);
		$this->subject = $_POST['cms_subscriber']['subject'];
		if(strpos($template,'.txt')!==false) {
			Session::set('content_type','text');
			Session::set('email',strip_tags(trim($this->email)));
		}
		else {
			Session::set('content_type','html');
			Session::set('email',$this->email);
		}
		Session::set('subject',$this->subject);
		Session::set('title',$_POST['cms_subscriber']['title']);
	}
	
	public function save_newsletter(){
		$newsletter = new CmsNewsletter;
		$newsletter->subject = Session::get('subject');
		$newsletter->title = Session::get('title');
		$newsletter->body = Session::get('email');
		$newsletter->content_type = Session::get('content_type');
		$newsletter->date_created = date('Y-m-d');
		$newsletter->save();
		Session::add_message($this->display_name." Successfully Saved");
  	$this->redirect_to('index');
	}
	
	public function view_newsletter(){
		$newsletter = new CmsNewsletter($this->param("id"));
		$this->id = $newsletter->id;
		$this->title = $newsletter->title;
		$this->subject = $newsletter->subject;
		$this->email = $newsletter->body;
		
		$newsletter_send_model = new CmsNewsletterSend;
		$this->send_results = $newsletter_send_model->find_all(array('conditions'=>'newsletter='.$this->param("id")));
		
	}
	
	public function manage_newsletters(){
		$newsletter_model = new CmsNewsletter();
		$this->newsletters = $newsletter_model->find_all();
	}
	
	public function history_newsletter(){
		$newsletter_send_model = new CmsNewsletterSend;
		$this->send_results = $newsletter_send_model->find_all(array('conditions'=>'newsletter='.$this->param("id")));
	}
	
	public function prepare_newsletter(){
		$newsletter = new CmsNewsletter($this->param("id"));
		$this->id = $newsletter->id;
		$this->title = $newsletter->title;
		$this->subject = $newsletter->subject;
		$this->email = $newsletter->body;
		
		$subscriber_groups = $this->model->find_by_sql("SELECT * FROM cms_tag_to_item WHERE model = '{$this->model_name}' GROUP BY tag");
		$this->groups = array();
		foreach($subscriber_groups as $group){
			$tag = new CmsTag($group->tag);
			$this->groups[$tag->id] = $tag->name;
		}
	}
	
	public function iframe_preview(){
		$content_type = 'html';
		if(!isset($_GET['id'])){
			$this->email = Session::get('email');
			if(Session::get('content_type') == 'text') $content_type = 'text';
		}
		else{
			$newsletter = new CmsNewsletter($_GET['id']);
			if($newsletter->content_type == 'text') $content_type = 'text';
			$this->email = $newsletter->body;
		}
		if($content_type == 'text') $this->use_layout="plaintext";
		else $this->use_layout="ajax";
	}
	
	public function confirm_newsletter(){
		$group = $_POST['group'];
		$subscriber_groups = $this->model->find_by_sql("SELECT COUNT(id) AS total FROM cms_tag_to_item WHERE model = '{$this->model_name}' AND tag = '{$group}'");
		$this->subscribers = $subscriber_groups[0]->total;
		
		// store newsletter in db
		$newsletter = new CmsNewsletter($_POST['id']);
		
		$this->timestamp = time();
		$this->newsletter_id = $newsletter->id;
		
		Session::set('group',$group);
		Session::set('newsletter',$newsletter->id);
		Session::set('timestamp', $this->timestamp);
	}
	
	public function send_newsletter(){
		if($_POST['timestamp'] != Session::get('timestamp')){
			// set error message and redirect
		}
		$group = Session::get('group');
		$newsletter_id = Session::get('newsletter');
		$newsletter = new CmsNewsletter($newsletter_id);
		$mailtype = 'html';
		
		$cms_tag_to_item_model = new CmsTagToItem;
		$subscriber_ids = $cms_tag_to_item_model->find_all(array('conditions'=>"tag=$group"));
		$this->attempted = sizeof($subscriber_ids);
		
		$cms_email = new CMSEmail();
		$cms_email->from = $this->from_address;
		$cms_email->fromName = $this->from_address;
		$cms_email->subject = 'tmp';
		if($mailtype == 'html') $cms_email->is_html(true);
		
		$logfile = WAX_ROOT."log/newsletter_{$group}_{$newsletter->id}.csv";
		$logfile_handle = fopen($logfile,'a+');
		chmod($logfile, 0777);
		$logfile_contents = fgetcsv($logfile_handle, filesize($logfile),",");
		if(!is_array($logfile_contents)) $logfile_contents = array();
		
		$this->screen_log_sent = array();
		$this->screen_log_fail = array();
		$this->screen_log_skipped = array();
		
		foreach($subscriber_ids as $value){
			$cms_subscriber = new CmsSubscriber($value->item);
			if(in_array($cms_subscriber->email,$logfile_contents)) $this->screen_log_skipped[] = $cms_subscriber->email;
			else{
				$cms_email->clear_to_address();
				$cms_email->add_to_address($cms_subscriber->email,$cms_subscriber->fullname);
				$cms_email->body = self::personalise_email($newsletter->body,$cms_subscriber);
				if($cms_email->send() === true){
					fputs($logfile_handle,"{$cms_subscriber->email},");
					$this->screen_log_sent[] = $cms_subscriber->email;
				}
				else $this->screen_log_fail[] = $cms_subscriber->email;
			}
		}
		$logfile_contents = fgetcsv($logfile_handle, filesize($logfile));
		fclose($logfile_handle);
		
		// save results to db
		$newsletter_send_model = new CmsNewsletterSend;
		$newsletter_send_model->date_created = date('Y-m-d H:i:s');
		$newsletter_send_model->attempted = $this->attempted;
		$newsletter_send_model->sent = sizeof($this->screen_log_sent);
		$newsletter_send_model->failed = sizeof($this->screen_log_fail);
		$newsletter_send_model->skipped = sizeof($this->screen_log_skipped);
		$newsletter_send_model->newsletter = $newsletter->id;
		$newsletter_send_model->group_tag = $group;
		$newsletter_send_model->save();
		//unset all session var
	}
	
	private function render_email($template, $content,$fill_param = false){
		$email = str_replace('__%CONTENT%',$content, $template);
		return $email;
	}
	
	private function personalise_email($email,$model){
		
		// rewrite urls to regonise user
		
		foreach($this->model->describe() as $att){
			$email = str_replace('__%'.strtoupper($att['Field']).'%',$model->$att['Field'], $email);
		}
		if(substr_count($email,'__%') > 0){
			throw new WXException("Unassigned Param in email content.", 'CMSCore');
		}
		return $email;
	}
	
	private function get_full_template_path($template){
		if(file_exists($this->app_template_dir.$template)){
			Session::set('mailtype','html');
			return $this->app_template_dir.$template;
		}
		else if(file_exists($this->cms_template_dir.$template)){
			Session::set('mailtype','html');
			return $this->cms_template_dir.$template;
		}
		else{
			Session::set('mailtype','plaintext');
			return $this->cms_template_dir."plain_text.txt";
		}
	}
}
?>