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
	
	protected function process_login() {
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
	  $this->stat_setup();
	  $this->stat_links = ($li = CmsConfiguration::get("stat_link_url")) ? $this->parse_rss($li, 5) : array();
	  $this->stat_search = ($li = CmsConfiguration::get("stat_search_url")) ? $this->parse_rss($li, 5) : array();
	  $this->stat_dash = ($li = CmsConfiguration::get("stat_dash_url")) ? $this->parse_rss($li, 5) : array();
	  $this->link_module = $this->render_partial("stat_links");
	  $this->search_module = $this->render_partial("stat_search");
	  $this->dash_module = $this->render_partial("stat_dash");
	  
		 //address module
			$this->address_details = CmsConfiguration::get('address');
			$address_details = unserialize($this->address_details);		
			$this->postcode = $address_details['postcode']; 
			$this->name = $address_details['name'];
			$this->address = $address_details['address']; 

			$this->email = $address_details['email_address'];
			$this->phone = $address_details['phone_number'];
			$this->fax	 = $address_details['fax_number'];
			$this->address_module = $this->render_partial("stat_address");
			//key
			$this->google_key = CmsConfiguration::get('google_key');
			$this->google_module = $this->render_partial("stat_google");
	}
	
	public function support() { $this->display_action_name = 'Support'; }

  public function parse_rss($url, $items) {
    $simple = simplexml_load_file($url, "SimpleXMLElement", LIBXML_NOCDATA);
    for($i=0; $i<$items; $i+=1) {
      $title = $simple->channel->item[$i]->title;
      $desc = $simple->channel->item[$i]->description;
      $link = $simple->channel->item[$i]->link;
      $rss[]=array($title, $desc, $link);
    }
    return $rss;
  }
  
  protected function stat_setup() {
    if($_POST['stat_link_url']) CmsConfiguration::set("stat_link_url", $_POST['stat_link_url']);
    if($_POST['stat_search_url']) CmsConfiguration::set("stat_search_url", $_POST['stat_search_url']);
    if($_POST['stat_dash_url']) CmsConfiguration::set("stat_dash_url", $_POST['stat_dash_url']);
		if($_POST['address']) CmsConfiguration::set("address", serialize($_POST['address'])	);
  }




}

?>