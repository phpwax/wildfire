<?php
/**
* Class defining basic building blocks of a CMS component
* Uses database to provide authentication
* @package PHP-WAX CMS
*/

class CMSBaseComponent extends WaxController {

  public $allowed_modules = array(); //all available modules for this user (ie this is just top level name)
  public $module_name = null; //the name of this module
  public $model = false;  //the actuall database model to use
  public $model_class; //the class name - ie WildfireContent
  public $model_scope = false;
  public $tree_scope = false;
  public $user_model_class = "WildfireUser";
  public $redirects = array('unauthorised'=> "/admin/login",
                            'authorised' => "/admin/home/",
                            'install'=> "/admin/install/",
                            'logout'=>"/admin/logout"
                            );
  public $use_plugin = "cms";
  public $display_name = 'CMS'; //display name of the module
  public $use_layout = "admin"; //the default layout to use
  public $per_page = 20; //the limit to use in lists
  public $this_page = 1;

  public $session; //session object
  public $user_session_name = "wf_v6_user";
  public $user_session_var_name = "user_id";
  public static $logged_in_user = false;
  public $filter_fields=array();
  public $model_filters=array();

  public $operation_actions = array('edit');
  public $quick_links = array();

  public $uploads = false;
  public $preview_hover = false;
  public $preview_click = false;
  public $dashboard = false;
  public $sort_scope = "";
  public $export_scope = "";
  public $exportable = false;
  public $export_group = false; //splits the results by this field, make multiple csv files and zips them
  public $sortable = false;
  public $scaffold_columns = false;

  public $search_results = array();
  public $use_cache = false;

  public $messages = array();
  public $file_system_model = "WildfireMedia";
  public static $restricted_tree = false;

  function __construct($application = false, $init=true) {
    parent::__construct($application);
    if($application) $this->events();
    WaxEvent::run("cms.session.setup", $this);
    if($init) $this->initialise();

  }

  public function controller_global(){
    parent::controller_global();
    WaxEvent::run("cms.layout.set", $this);
    WaxEvent::run("cms.format.set", $this);
  }

  public function __destruct(){
    WaxEvent::run("cms.destruct", $this);
  }

  public function user_from_session($session_name="wf_v6_user"){
    //echo "<a href='/admin/home/?".$this->session->name."=".$this->session->id."'>login</a>";
    //exit;
    $user_model = new $this->user_model_class;
    if($id = $this->session->get($session_name)){
      if(self::$logged_in_user) return self::$logged_in_user;
      if(($model = new $this->user_model_class($id)) && $model->primval == $id) return self::$logged_in_user = $model;
    }
    //token based auth
    elseif(($auth = Request::param('auth_token')) && ($found = $user_model->filter("auth_token", $auth)->first())){
      return self::$logged_in_user = $found;
    }
    return false;
  }

  protected function events(){
    WaxEvent::add("cms.session.setup", function(){
      $controller = WaxEvent::data();
      $controller->session = new WaxSession(array("name"=>$controller->user_session_name,"lifetime"=>60*60*24*30));
    });
    WaxEvent::add("cms.layout.set", function(){
      $obj = WaxEvent::data();
      $obj->use_layout = "login";
    });
    WaxEvent::add("cms.format.set", function(){
      $obj = WaxEvent::data();
      $obj->use_format = "json";

    });
    WaxEvent::add("cms.layout.sublinks", function(){});
    WaxEvent::add('cms.search.'.$this->module_name, function(){});
  }
  /**
   * initialises authentication, default model and menu items
   **/
  protected function initialise(){}

  public function sync($path, $filename=""){}

  protected function add_file($folderpath,$filename,$rpath,$fileid){}

  public function add_message($message, $class){
    $messages = $this->session->get("messages");
    $messages[] = array('message'=>$message, 'class'=>$class);
    $this->session->set("messages", $messages);
  }
}
?>
