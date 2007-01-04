<?php
/**
* Class giving an admin interface to manipulate subscribers
* @package CMSPlugin
* @author WebXpress <charles@webxpress.com>
* @version 1.0
*/

class CMSAdminSubscriptionController extends CMSAdminComponent {
		
  public $model;
	public $model_class="CmsSubscription";
	public $db_table;
	public $display_name = "Subscribers";
	public $cmssub;
	public $fromEmail = "subs@spirit-fit.com";
	
	public function index(){
		$this->cmssub = new CmsSubscription();
		$this->list_limit = 15;
		parent::index();		
		//hack to include the helper file
		Autoloader::include_from_registry('EmailTemplateHelper');
		Autoloader::register_helpers();
	}	
	
	public function csv(){
		$this->csv = $this->generate_csv();
		$this->use_layout = false;
		header("Content-type: application/csv");
		header('Content-Disposition: attachment; filename="subs.csv"');
	
	}	
	/**
	* Edit model item in lightbox interface - has shared view cms/view/CONTROLLER/_form.html
	*/
	public function edit() {
	  $this->id = $this->param("id");
	  $this->use_layout= "lightbox";
    $this->model = new $this->model_class($this->id);
		$this->form = $this->render_partial("form");
		if(!$this->save($this->model) && $this->model->is_posted() ){
			$errors = $this->model->get_errors();
					
 			foreach($errors as $error){
				Session::add_error($error['field']." ".$error['message']);
			}
			$this->redirect_to($this->referrer);
		}
	}
	
	public function email(){
		$this->display_name = "Mailout Results";
	
		if(empty($_POST['sendto'])) {
			Session::add_error('At least one recipient must be selected to send email');
			$this->redirect_to($this->referrer);
		}
		elseif(empty($_POST['emailtemplate'])) {
			Session::add_message('Please Select a Template');
			$this->redirect_to($this->referrer);
		}
		//if send all button is used
		elseif(!empty($_POST['send_all_x']) || !empty($_POST['send_all_y']) ){
			$all_emails = new CmsSubscription();
			$sql = "SELECT * FROM cms_subscription GROUP BY email";
			$all_emails = $all_emails->find_by_sql($sql);
			$this->send_all_emails($all_emails, $_POST['emailtemplate']);
		}
		//otherwise send the emails
		else{
				$this->send_all_emails( $_POST['sendto'], $_POST['emailtemplate']);				
		}			
						
	}	

	private function generate_csv(){
		
		$all 			= new CmsSubscription();
		$options	= $this->route_array[0];
		if($options == "active") {
			$cols		= array("name", "email");
			$params	= array('columns'=> implode(", ", $cols), 'conditions' => "status = 1"); 
		} else {
			$cols		= array("name", "email", "status");
			$params	= array('columns'=> implode(", ", $cols) );
		}
		$results	= $all->find_all($params);
		$string 	= "";
		foreach($results as $result) {
			foreach($cols as $field) {
				$string .= $result->$field . ",";
			}
			$string .= "\r\n";
		}
		
		return $string;
	}
	
	
	private function send_all_emails($emails, $template){
						
		foreach($emails as $email) {
			if(is_numeric($email)){			
				$email = new CmsSubscription($email);			
			}			
			if($this->send_email($email, $template)) {
				Session::add_message('Successful -> ' .$email->email);
			} else {
			 	Session::add_error('Already Sent -> '.$email->email);
			}
			
		}	
			
	}

	private function send_email($info, $template){

		if(!$info->email_md5){
			$info->email_md5 = md5($info->email);
			$info->update();
		}
	
		if(!$this->has_been_sent($info->email, $template) ){
			$email = new WXEmail();
			$email->from = $this->fromEmail;
			$email->fromName = "Spirit Health Clubs"
			$email->subject	 = str_ireplace("-", " ", $template);
			$email->add_to_address($info->email);
			$email->is_html(true);
			$email->body = file_get_contents(VIEW_DIR . "emailtemplates/".$template.".html");
			$email->body = $this->do_replacements($email->body, $info);
			$email->send();
			$this->mark_as_sent($info->id, $info->email, $template);	
			return true;		
		} else{
			return false;
		}
	}
	
	/**
	 * checks the DB table to see an email of this 
	 * template has been sent today
	 */
	private function has_been_sent($email, $template){
		$sent = new CmsEmailsSent();
		$params = array('conditions'=>" email='$email' AND template='$template'", 'columns'=>"count(*) as cnt");		
			
		$count = $sent->find_all($params);		
			
		if($count[0]->cnt > 0){
			return true;
		} else {
			return false;
		}
	}
	/**
	 * enter into db record of the template being sent
	 */
	private function mark_as_sent($id, $email, $template) {
		$sent = new CmsEmailsSent();
		$sent->email 		= $email;
		$sent->template = $template;
		$sent->save();
		
		$sub = new CmsSubscription($id);
		$sub->used_voucher = 0;
		$sub->voucher_code = date("Ydm");
		$sub->update();
	}
	
	/**
	 * loop though the fields of the model & enter them into the email
	 */
	private function do_replacements($string, $model){
		
		foreach($model as $field=>$value){			
			$string = str_ireplace("%" . $field . "%", $value, $string);
		}
		return $string;
	}
}
?>