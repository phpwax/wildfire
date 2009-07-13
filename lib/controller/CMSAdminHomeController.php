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
	
	public $content_permissions = false;
	public $analytics_email = false;
	public $analytics_password = false;	
	public $analytics_id = false;
	
	public $permissions = array("stats");
	
	/**
	* As the home page of the admin area has no sub nav, this clears the links
	**/
  function __construct($initialise = true) {
    parent::__construct($initialise);
    if($initialise) $this->initialise();
    $this->permissions = array_diff($this->permissions, array("menu","enabled")); //home controller needs to be there, so we don't allow set/unset on it
  }
	
	private function initialise(){
		$this->analytics_email = Config::get("analytics/email");
		$this->analytics_password = Config::get("analytics/password");
		$this->analytics_id = Config::get("analytics/id");
		$this->sub_links = array();
		if($this->current_user && $this->current_user->access("content","create")) $this->sub_links["../content/create"] = "Create New Content";
		$this->sub_links["../.."] = "View Site";
	}
	/**
	* protected function that handles the actual db authentication check on first login
	* now also logs data regarding who has logged in
	* @return String url to redirect to
	**/
	protected function process_login() {
		$auth = new WaxAuthDb(array("db_table"=>$this->model_name, "session_key"=>"wildfire_user_cookie", 'encrypt'=>false));
		if( $auth->verify($_POST['username'], $_POST['password'])){
		  $log = new WildfireLog;
		  $log->action="login";
		  $log->user=$auth->get_user();
		  $log->time = date("Y-m-d H:i:s");
		  $log->save();
		  $perm_model = new CmsPermission;
		  if(!count($perm_model->all())) return '/admin/home/convert_to_v3';
		  elseif($this->authorised_redirect) return $this->authorised_redirect;		  
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
	  $users_model = new $this->model_class;
	  if(!count($users_model->all())) $this->redirect_to($this->no_users_redirect);
		if(count($_POST)>0) $this->redirect_to($this->process_login() );
		Session::set( 'timestamp', time() );
		Session::unset_var('errors');
		$this->use_layout = "login";
		$this->redirect_url = Session::get('referrer');
		$this->form = new LoginForm;
	}
	
	public function install(){
	  $users_model = new $this->model_class;
	  if(count($users_model->all())) $this->redirect_to($this->unauthorised_redirect);
	  $this->use_layout = "login";
	  $this->form = new InstallForm();
	  if($this->form->save()){
	    $new_user = new $this->model_class;
	    $new_user->username = $this->form->username->value;
	    $new_user->password = $this->form->password->value;
	    if($new_user->save()){
	      $permission = new CmsPermission;
        foreach(CMSApplication::$modules as $name => $module_options){
          $controller_class = WaxUrl::route_controller(trim($module_options['link'],"/"));
          $controller_class = Inflections::slashcamelize($controller_class, true)."Controller";
          $controller = new $controller_class(false); //instantiate classes without intialising them
          foreach($controller->permissions as $operation){
            $perm = new CmsPermission;
            $perm->class = $name;
            $perm->operation = $operation;
            $perm->allowed = 1;
            $perm->user = $new_user; //foreign key triggers a save
          }
        }
      }
      $_POST['username'] = $new_user->username;
      $_POST['password'] = $new_user->password;
	    $this->redirect_to($this->process_login());
	  }else{
  	  Session::unset_var('user_messages');
  	  Session::add_message($this->no_users_message);
	  }
	}
	/**
	 * conversion routine to new permissions based system
	 */	
	public function convert_to_v3(){
    $config = CmsConfiguration::get('modules');
    $registered = $config['enabled_modules'];
    $user_model = new $this->model_class;
    $permission = new CmsPermission;
    foreach($user_model->clear()->all() as $user){
      if($user->usergroup < 30 && $registered) $all_mods = $registered;
      else $all_mods = CMSApplication::$modules;
      foreach($all_mods as $name => $module_options){
        $controller_class = WaxUrl::route_controller(trim($module_options['link'],"/"));
        $controller_class = Inflections::slashcamelize($controller_class, true)."Controller";
        $controller = new $controller_class(false); //instantiate classes without intialising them
        foreach($controller->permissions as $operation){
          $perm = new CmsPermission;
          $perm->class = $name;
          $perm->operation = $operation;
          $perm->allowed = 1;
          $perm->user = $new_user; //foreign key triggers a save
        }
      }
    }
    $this->redirect_to("/admin/home/");
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
    if(!$this->stat_links = $this->pageview_data()) $this->stat_links = array();
    if(!$this->stat_search = $this->searchrefer_data()) $this->stat_search = array();
 	  unset($this->sub_links["index"]);
 	  $content = new CmsContent;
 	  if($this->current_user->access("content","view")){
 	    if($ids = $this->current_user->allowed_sections_ids) $content->filter(array("cms_section_id"=>$ids));
 	    $this->recent_content = $content->scope_published()->limit(10)->all();
 	  }else $this->recent_content = array();
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
  
  public function visitor_data() {
    if($this->current_user->access($module_name,"stats")){
      $api = new GoogleAnalytics();
      if($api->login($this->analytics_email, $this->analytics_password)) {
      	$api->load_accounts();
      	$this->visit_data = $api->data($this->analytics_id, 'ga:day,ga:date', 'ga:visitors', "-ga:date",false,false,7);
      	$chart = new OpenFlashChart();
      	$chart->add_title("");
      	$labels = array();
      	$visits = array();
      	foreach($this->visit_data as $visit=>$data) $labels[]=date("D j",strtotime(key($data)));
      	foreach($this->visit_data as $visit=>$data) {
      	  $visits[]=array("value"=>(int)$data[key($data)]["ga:visitors"],"tip"=>"#val# visits");
      	  $raw_visits[]=(int)$data[key($data)]["ga:visitors"];
      	}
      	$raw_visits = array_reverse($raw_visits);
        $chart->add_x_axis(array("labels"=>array("labels"=>array_reverse($labels) ,"colour"=>"#E1E1E1","size"=>9),"colour"=>"#D1D1D1","grid-colour"=>"#333333","stroke"=>1,"font-size"=>9  ));
        $chart->add_y_axis(array("labels"=>array("colour"=>"#E1E1E1","size"=>9),"stroke"=>1,"font-size"=>9,"colour"=>"#D1D1D1","grid-colour"=>"#333333","min"=>0,"max"=>max($raw_visits)+10,"steps"=>ceil(max($raw_visits)/100)*10));
        $chart->add_y_legend("Unique Visitors", "{font-size: 11px; color:#999999;text-align: center;}");
        $chart->add_element(array(
          "values"=>array_reverse($visits), 
          "type"=>"line", 
          "text"=>"Visits", 
          "colour"=>"#a3ce44",
          "dot-style"=>array(
            "type"=>"solid-dot",
            "dot-size"=>3,
            "halo-size"=>2,
            "colour"=>"#e76f34"
          ),
          "font-size"=>9
        ));
        $chart->add_value("bg_colour","#414141");
        echo $chart->render(); exit;
      } else throw new WaxException("Failed Connection To Google Analytics");
    } else throw new WaxException("No Access To Google Analytics");
  }
  
  public function pageview_data() {
    if($this->current_user->access($module_name,"stats")){
      $api = new GoogleAnalytics();
      if(!$this->analytics_email || !$this->analytics_password) return false;
      if($api->login($this->analytics_email, $this->analytics_password)) {
      	$api->load_accounts();
      	$this->pages_data = $api->data($this->analytics_id, 'ga:source,ga:referralPath', 'ga:visits');
      	foreach($this->pages_data as $source=>$pages) {
      	  foreach($pages as $page=>$visits) {
      	    $subs[$visits["ga:visits"]]=array("name"=>$source, "url"=>"http://".str_replace("(direct)","strangeglue",$source).str_replace("(not set)",".com",$page),"visits"=>$visits["ga:visits"]);
      	  }
      	}

  			if(count($subs)){
  				krsort($subs);
  				return $subs;
  			}else return array();
      } else return false;
    } else throw new WaxException("No Access To Google Analytics");
  }
  
  public function searchrefer_data() {
    if($this->current_user->access($module_name,"stats")){
      $api = new GoogleAnalytics();
      if($api->login($this->analytics_email, $this->analytics_password)) {
      	$api->load_accounts();
      	$this->pages_data = $api->data($this->analytics_id, 'ga:keyword', 'ga:visits');
      	array_shift($this->pages_data);
      	foreach($this->pages_data as $source=>$count) {
      	  $subs[]=array("link"=>"http://google.co.uk/search?q=".$source, "keyword"=>$source,"count"=>$count["ga:visits"]);
      	}
        return $subs;
      } else return false;
    } else throw new WaxException("No Access To Google Analytics");
  }
}

?>