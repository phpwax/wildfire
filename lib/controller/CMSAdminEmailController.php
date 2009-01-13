<?php

class CMSAdminEmailController extends CMSAdminComponent {
	public $module_name = "email";											
	public $model_class = 'Client';
	public $model_name = "client";													
	public $display_name = "Email";
	
	public $scaffold_columns = array(
    "Subject"   =>array(),
    "SentDate" => array(),
		"TotalRecipients" => array()
  );
  public $filter_columns = false;
	public $allowed_images = false; //no images
	public $allowed_categories = flase; //no categories
	public $edit_author = false; 
	public $extra_content = array(); //extra content fields - runs off the cms_extra_content table
	public $extra_content_options = array(); //corresponding config for the fields
	public $default_order = 'published';
	public $default_direction = 'DESC';
	
	public $show_operations = false;
	
	function __construct() {
		/**
		* authentication
		**/
		$auth = new WaxAuthDb(array("encrypt"=>false, "db_table"=>$this->auth_database_table, "session_key"=>"wildfire_user"));
		$this->current_user = $auth->get_user();
		if($this->current_user->usergroup==30) $this->is_admin=true;
		/**
		* module setup
		**/
		$this->before_filter("all", "check_authorised", array("login"));
		$this->configure_modules();
		$this->all_modules = CMSApplication::get_modules(true);
		if(!array_key_exists($this->module_name,CMSApplication::get_modules())){
			Session::add_message('This component is not registered with the application.');
			$this->redirect_to('/admin/home/index');
		}
		/**
		* model instanciation
		**/
		$this->cm_conf = CmsConfiguration::get("general");
		if($this->model_class) {							
			$this->model = new $this->model_class($this->cm_conf['campaign_monitor_ClientID']);
		  $this->model_name = WXInflections::underscore($this->model_class);
	  }
		$this->sub_links["create"] = "Create New ". $this->display_name;
		$this->sub_links["view_subscriber"] = "View Subscribers";
		$this->sub_links["view_segments"] = "View Segments";
		if(!$this->this_page = WaxUrl::get("page")) $this->this_page=1;
	}
	
	/**
	* magic method to catch all if the action thats requested doesn't exist
	* this function is used for the section filter drop down; which creates a url like /admin/content/section-url
	* and this converts that into a filtered view of the content by the section specified
	**/
	public function method_missing() {
	  if(!$page = $this->param("page")) $page=1;
		$this->all_rows = $this->model->all();
		$this->filter_block_partial = $this->render_partial("filter_block");
		$this->list = $this->render_partial("list");
	}
	/**
	* main listing page - 
	**/
	public function index() {
	  if(!$page = $this->param("page")) $page=1;		
	  Session::set("list_refer", $_SERVER['REQUEST_URI']);	  
		$this->display_action_name = 'List Campaigns';
		$this->all_rows = $this->model->all();	
		$this->filter_block_partial ="";
		$this->list = $this->render_partial("list");
	}
	
	

	public function edit() {}
	public function create(){
		$this->display_action_name = 'Create';
		$model = $this->model;
		$this->model = new Campaign($this->cm_conf['campaign_monitor_ClientID']);		
		if($this->model->is_posted()){
			$this->model = $this->model->handle_post();
			if($this->model->primval() > 0){
				Session::add_message('Your campaign has been created!');
				$this->redirect_to('/admin/email');
			}else Session::add_message('There was an error creating you campaign:<br/> '. print_r($this->model->errors,1));
		}		
		
		$lists = $model->GetLists();
		$this->mail_lists = array_merge(array(''=>array('ListID'=>'', 'Name'=>'None')), $lists->rowset);
		$segments = $model->GetSegments();
		$this->segments = array_merge(array(''=>array('ListID'=>'', 'Name'=>'None')), $segments->rowset);
		$cont = new CmsContent("published");
		$this->contents = $cont->all();


		$this->form = $this->render_partial("form");
	}
	
	public function view_subscriber(){
		$this->client_lists = $this->model->GetLists();
		if(!$this->list_id = Request::param('id') ){
			$client_list = $this->client_lists->row[0];
			$this->list_id = $client_list['ListID'];
		}	
		Session::set("list_refer", $_SERVER['REQUEST_URI']);
		$this->set_order();
		$this->display_action_name = 'List Subs';
		$this->subs_model	= new Subscriber($this->list_id);
		$this->all_rows = $this->subs_model->all();
		if(!$this->all_rows) $this->all_rows=array();		

		$this->use_view = "index";
		$this->scaffold_columns = array(
	    "Name"   =>array(),
	    "Email" => array(),
			"Date" => array()
	  );
		$this->drop_down_options = $this->client_lists->rowset;
		$this->drop_down_cols = array('key'=>'ListID', 'val'=>'Name');
		
		$this->filter_block_partial = $this->render_partial("filter_block");
		$this->list = $this->render_partial("list");
	}
	
	
	public function view_segments(){		
		Session::set("list_refer", $_SERVER['REQUEST_URI']);
		$this->set_order();
		$this->display_action_name = 'List Seg';
		$this->all_rows = $this->model->GetSegments();
		if(!$this->all_rows) $this->all_rows=array();		
		$this->use_view = "index";
		$this->scaffold_columns = array(
	    "ListID"   =>array('display'=>'Segment ID'),
	    "Name" => array()
	  );
		$this->drop_down_options = false;
		$this->drop_down_cols = false;
		
		$this->filter_block_partial = "";
		$this->list = $this->render_partial("list");
	}
	
	
	
	
}
?>
