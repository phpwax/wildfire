<?php
/**
* Home page controller
* @package PHP-WAX CMS
*/

class CMSAdminHomeController extends CMSAdminComponent {
	public $module_name = "home";												
  public $model;
	public $model_name = "wildfire_user";
	public $model_class = "WildfireUser";
	public $display_name = "Home";
	public $base_url;
	
	function __construct(){
		parent::__construct();
		$this->sub_links = array();
	}
	
	protected function process_login() {
		$auth = new WaxAuthDb(array("db_table"=>$this->model_name, "session_key"=>"wildfire_user"));
		if( $auth->verify($_POST['username'], $_POST['password'])){
		  $log = new WildfireLog;
		  $log->action="login";
		  $log->user=$auth->get_user();
		  $log->time = date("Y-m-d H:i:s");
		  $log->save();
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
		$auth = new WaxAuthDb(array("db_table"=>$this->model_name, "session_key"=>"wildfire_user"));
		$auth->logout();
		$this->redirect_to('/');
	}
	
	public function index() {
	  $this->stat_links = ($li = CmsConfiguration::get("stat_link_url")) ? $this->parse_xml($li, 5, 'referrer') : array();
	  $this->stat_search = ($li = CmsConfiguration::get("stat_search_url")) ? $this->parse_xml($li, 5, 'search') : array();
	  $this->stat_dash = ($li = CmsConfiguration::get("stat_dash_url")) ? $this->parse_xml($li, 5, "visit_day") : array();
	  $this->link_module = $this->render_partial("stat_links");
	  $this->search_module = $this->render_partial("stat_search");
	  $this->dash_module = $this->render_partial("stat_dash");
 	}
	
	public function support() { 
		$this->display_action_name = 'Support';
		$this->guides = array();
		foreach($this->all_modules as $module=>$value){
			if(file_exists(PLUGIN_DIR."cms/view/CMSAdminHomeController/_{$module}.html")) $this->guides[$module] = $this->render_partial($module);
		}
	}
  
  public function parse_xml($url, $limit, $child=false) {
    $simple = simplexml_load_file($url, "SimpleXMLElement", LIBXML_NOCDATA);
    if($child) {
      for($i=0; $i<$limit; $i++) {
        if($simple->{$child}[$i]) $res[] = $simple->{$child}[$i];
      }
      return $res;
    }
    return $simple;
  }
}

?>