<?php
/**
* Class defining basic building blocks of a CMS component
* Uses database to provide authentication
* @package PHP-WAX CMS
*/
/**
 * load in the cms helper file
 */
Autoloader::include_from_registry('CMSHelper');
Autoloader::register_helpers();

class CMSAdminComponent extends CMSBaseComponent {

	public $current_user=false; //the currently logged in
	//filter details
	public $filter_partial="_filters";
	public $filter_fields=array(
                          'text' => array('columns'=>array('title'), 'partial'=>'_filters_text')
	                      );
  public $scaffold_columns = false; //when this is false, uses columns from the model automatically
  //check user is allowed to do this!
  public function controller_global(){
    parent::controller_global();

    WaxEvent::add("cms.permissions.check_action", function() {
      $obj = WaxEvent::$data;
      if(!$obj->current_user->allowed($obj->module_name, $obj->action)) $obj->redirect_to($obj->redirects['unauthorised']);
    });
    
    WaxEvent::run("cms.permission.check_action", $this);

  }

	/**
	 * initialises authentication, default model and menu items
	 **/
	protected function initialise(){  
	  
	  WaxEvent::add("cms.permissions.logged_in_user", function() {
      $obj = WaxEvent::$data;
      if(!$obj->current_user = $obj->user_from_session($obj->user_session_name)) $obj->redirect_to($obj->redirects['unauthorised']);
    });

	  WaxEvent::add("cms.permissions.all_modules", function(){
	    $obj = WaxEvent::$data;
	    foreach(CMSApplication::get_modules() as $name=>$info){
	      $class = "CMSAdmin".Inflections::camelize($name,true)."Controller";
	      if($obj->current_user->allowed($name, "index")) $obj->allowed_modules[$name] = $info;
	    }
    });
    WaxEvent::add("cms.model.pagination", function(){
      $obj = WaxEvent::$data;
	    if($pg = Request::param('page')) $obj->this_page = $pg;
      if($pp = Request::param('per_page')) $obj->per_page = $pp;
	  });
	  
	  WaxEvent::add("cms.model.column_setup", function(){
	    $obj = WaxEvent::$data;
	    if(!$obj->scaffold_columns){
	      $model = new $obj->model_class;
	      foreach($model->columns as $col=>$info) if($info[1]['scaffold']) $obj->scaffold_columns[$col] = true;
	    }
	  });
	  
    WaxEvent::run("cms.permissions.logged_in_user", $this);
	  WaxEvent::run("cms.permissions.all_modules", $this);
    WaxEvent::run("cms.model.pagination", $this);
    WaxEvent::run("cms.model.column_setup", $this);
	}


	/**
	* Default view - lists all model items - has shared view cms/view/shared/list.html
	*/
	public function index(){
	  WaxEvent::add("cms.index.all", function(){
	    $obj = WaxEvent::$data;
	    $obj->model = $obj->_handle_filters(new $obj->model_class($obj->model_scope), Request::param('filters'));      
	    $obj->cms_content = $obj->model->page($obj->this_page, $obj->per_page);
    });
    WaxEvent::run("cms.index.all", $this);
	}

	public function edit(){
	  $this->model = new $this->model_class(Request::get("id"));
	  $this->form = new WaxForm($this->model);
	}

	public function create(){
	  $this->model = new $this->model_class();
	}

  public function _handle_filters($model, $filters){
    $filterstring = "";
    foreach((array)$filters as $name=>$value){
      if($this->filter_fields[$name]){
        foreach($this->filter_fields[$name]['columns'] as $col) $filterstring = "`$col` LIKE '%".mysql_real_escape_string($value)."%' OR";
      }
    }
    if($filterstring) $model->filter(trim($filterstring, " OR"));
    return $model;
  }

}
?>
