<?php
/**
* Home page controller
* @package PHP-WAX CMS
*/

class CMSAdminHomeController extends CMSAdminComponent {
	public $module_name = "home";												
  public $model = "CmsUser";
	public $model_class;
	public $display_name = "Home";
	public $base_url;
	
	function __construct(){
		parent::__construct();
		$this->sub_links = array();
	}
	
	private function process_login() {
		$auth = new CMSAuthorise($this->model);
		if( $auth->verify( $_POST['username'], $_POST['password'] ) === true ){
		  if($_POST['redirect'] && !strpos($_POST['redirect'], "login")) return $_POST['redirect'];
			else return 'index';
		}
		else {
		  Session::add_message("Sorry, we can't find that username and password. Try again.");
			return $this->unauthorised_redirect;
		}
	}
				
	public function login() {
		if(count($_POST)>0) $this->redirect_to($this->process_login() );
		Session::set( 'timestamp', time() );
		Session::unset_var('errors');
		$this->use_layout = "login";
		$this->redirect_url = Session::get('referrer');
	}
	
	public function logout( ) {
		$auth = new CMSAuthorise($this->model);
		$auth->logout();
		$this->redirect_to('/');
	}
	
	public function index() {
		$this->display_action_name = 'Welcome';
		$page_model = new CmsPage;
		$this->page_rows = $page_model->find_all(array('limit'=>5));
		$article_model = new CmsArticle;
		$this->article_rows = $article_model->find_all(array('limit'=>5));
	}
	
	public function support() { $this->display_action_name = 'Support'; }
}
?>