<?php
/**
* Home page controller
* @package PHP-WAX CMS
*/

class CMSAdminHomeController extends AdminComponent {
	public $module_name = "home";												
  public $model;
	public $model_name = "wildfire_user";
	public $model_class = "WildfireUser";
	public $display_name = "Dashboard";
	public $base_url;
	public $modal_preview = false;
	/**
	* As the home page of the admin area has no sub nav, this clears the links
	**/
	function __construct(){
		parent::__construct();
		$this->sub_links = array();
		$this->sub_links["../content/create"] = "Create New Content";
		$this->sub_links["../.."] = "View Site";
	}
	/**
	* protected function that handles the actual db authentication check on first login
	* now also logs data regarding who has logged in
	* @return String url to redirect to
	**/
	protected function process_login() {
		$auth = new WaxAuthDb(array("db_table"=>$this->model_name, "session_key"=>"wildfire_user_cookie"));
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
	/**
	* public action to handle the login posted data
	**/			
	public function login() {
		if(count($_POST)>0) $this->redirect_to($this->process_login() );
		Session::set( 'timestamp', time() );
		Session::unset_var('errors');
		$this->use_layout = "login";
		$this->redirect_url = Session::get('referrer');
		$this->form = new LoginForm;
	}
	/**
	* Clears the session data via a call to the auth object - effectively logging you out
	**/
	public function logout( ) {
		$auth = new WaxAuthDb(array("db_table"=>$this->model_name, "session_key"=>"wildfire_user_cookie"));
		$auth->logout();
		$this->redirect_to($this->unauthorised_redirect);  	
	}
	/**
	* home page - shows statistical summaries
	**/
	public function index() {
	  $general_conf = CmsConfiguration::get("general");	  
    $this->stats_site_id = $general_conf["statsid"];
    if($this->stats_site_id){
      $this->stat_search = unserialize(file_get_contents("http://stats.oneblackbear.com/index.php?module=API&method=Referers.getKeywords&idSite=". $this->stats_site_id."&period=week&date=yesterday&format=PHP&token_auth=ae290d98aa13255678682381827a6862"));
	    $this->stat_links = unserialize(file_get_contents("http://stats.oneblackbear.com/index.php?module=API&method=Referers.getWebsites&idSite=". $this->stats_site_id."&period=week&date=yesterday&format=PHP&token_auth=ae290d98aa13255678682381827a6862"));
    }else{
      $this->stat_search = $this->stat_links = array();
    }
    if($this->stat_links["result"]=="error") $this->stat_links = array();
    if($this->stat_search["result"]=="error") $this->stat_search = array();
 	  unset($this->sub_links["index"]);
 	  $content = new CmsContent;
 	  $this->recent_content = $content->limit(7)->filter("status < 3")->order("id DESC")->all();
 	  $this->can_see_stats = $this->can_see_stats();
 	}
	/**
	* help pages - content is generated via partials (we really should write some more of these...)
	**/
	public function support() { 
		$this->display_action_name = 'Support';
		$this->guides = array();
		foreach($this->all_modules as $module=>$value){
			if(file_exists(PLUGIN_DIR."cms/view/CMSAdminHomeController/_{$module}.html")) $this->guides[$module] = $this->render_partial($module);
		}
	}
  /**
	* function to read in and parse data from the url passed
	* @param String $url
	* @param Integer $limit
	* @param Boolean $child
	* @return Array or SimpleXML Object 
	**/
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
  
  public function can_see_stats() { return true;}
  
  
  
  
}

?>