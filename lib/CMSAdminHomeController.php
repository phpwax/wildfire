<?php
/**
* Home page controller
* @package PHP-WAX CMS
*/

class CMSAdminHomeController extends CMSAdminComponent {
	public $module_name = "home";												
  	public $model;
	public $model_name = "cms_user";
	public $model_class = "CmsUser";
	public $display_name = "Home";
	public $base_url;
	
	function __construct(){
		parent::__construct();
		$this->sub_links = array();
	}
	
	private function process_login() {
		$auth = new WXDBAuthenticate(array("db_table"=>$this->model_name));
		if( $auth->verify($_POST['username'], $_POST['password'])){
		  if($this->authorised_redirect) return $this->authorised_redirect;		  
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
		$auth = new WXDBAuthenticate(array("db_table"=>$this->model_name));
		$auth->logout();
		$this->redirect_to('/');
	}
	
	public function index() {
    $this->links = $this->parse_rss("http://getclicky.com/stats/feed/1480/a661180b0d9b/links", "5");
	}
	
	public function support() { $this->display_action_name = 'Support'; }

  public function parse_rss($url, $items) {
    ini_set("allow_url_fopen","on");
    $simple = simplexml_load_file($url);
    for($i=0; $i<$items; $i+=1) {
      $title = $simple->item[$i]->title;
      $desc = $simple->item[$i]->description;
      $link = $simple->item[$i]->link;
      $rss[]=array($title, $desc, $link);
    }
    return $rss;
  }




}

?>