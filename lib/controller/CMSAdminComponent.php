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
                          'text' => array('columns'=>array('title'), 'partial'=>'_filters_text', 'fuzzy'=>true)
	                      );
  public $scaffold_columns = false; //when this is false, uses columns from the model automatically
  //check user is allowed to do this!
  public function controller_global(){
    parent::controller_global();

    WaxEvent::run("cms.permission.check_action", $this);

  }

  protected function events(){
    /**
     * permissions
     */
    WaxEvent::add("cms.permissions.check_action", function() {
      $obj = WaxEvent::$data;
      if(!$obj->current_user->allowed($obj->module_name, $obj->action)) $obj->redirect_to($obj->redirects['unauthorised']);
    });
    
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
    /** 
     * models
     */
    WaxEvent::add("cms.model.init", function(){
      $obj = WaxEvent::$data;
      $obj->model = new $obj->model_class($obj->model_scope);
    });
    WaxEvent::add("cms.pagination", function(){
      $obj = WaxEvent::$data;
	    if($pg = Request::param('page')) $obj->this_page = $pg;
      if($pp = Request::param('per_page')) $obj->per_page = $pp;
	  });
	  
    WaxEvent::add("cms.model.filters", function(){
      $obj = WaxEvent::$data;
      if(!$filters = $obj->model_filters) $obj->model_filters = Request::param('filters');
      $filterstring = "";
      
      foreach((array)$obj->model_filters as $name=>$value){
        $col_filter = "";
        if($filter = $obj->filter_fields[$name]){
          foreach($filter['columns'] as $col){
            if($filter['fuzzy']) $col_filter .= "`$col` LIKE '%".mysql_real_escape_string($value)."%' OR";
            else $col_filter .= "`$col`='".mysql_real_escape_string($value)."' OR";
          }
          $filterstring .= "(".trim($col_filter, " OR").") AND ";
        }
      }
      if($filterstring) $obj->model->filter(trim($filterstring, " AND "));
    });
    
	  WaxEvent::add("cms.model.columns", function(){
	    $obj = WaxEvent::$data;
	    if(!$obj->scaffold_columns){
	      $model = new $obj->model_class;
	      foreach($model->columns as $col=>$info) if($info[1]['scaffold']) $obj->scaffold_columns[$col] = true;
	    }
	  });

    WaxEvent::add("cms.save.before", function(){
	  
	  WaxEvent::add("cms.model.setup", function(){
	    $obj = WaxEvent::$data;
	    WaxEvent::run("cms.model.init", $obj);
	    WaxEvent::run("cms.pagination", $obj);
	    WaxEvent::run("cms.model.columns", $obj);
	    WaxEvent::run("cms.model.filters", $obj);	    
	  });
    /**
     * view setups
     */
    WaxEvent::add("cms.index.setup", function(){
      $obj = WaxEvent::$data;
      $obj->cms_content = $obj->model->page($obj->this_page, $obj->per_page);
    });
    
    WaxEvent::add("cms.save.after", function(){
      $obj = WaxEvent::$data;
      $obj->save_after();
    });
    WaxEvent::add("cms.save.success", function(){
      $obj = WaxEvent::$data;
      $obj->save_success();
    });
    WaxEvent::add("cms.save", function(){
	    $obj = WaxEvent::$data;
	    WaxEvent::run("cms.save.before", $obj);
	    if($obj->saved = $obj->form->save()){
	      Session::add_message('Content saved.');
	      $obj->model = $obj->saved;
	      WaxEvent::run("cms.save.success", $obj);
	    }
	    WaxEvent::run("cms.save.after", $obj);
	  });
  }
	/**
	 * initialises authentication, default model and menu items
	 **/
	protected function initialise(){  
    $this->events();
    WaxEvent::run("cms.permissions.logged_in_user", $this);
	  WaxEvent::run("cms.permissions.all_modules", $this);
    WaxEvent::run("cms.model.pagination", $this);
    WaxEvent::run("cms.model.column_setup", $this);
    WaxEvent::run("cms.model.setup", $this);
    WaxEvent::run("cms.form.setup", $this);
	}


	/**
	* Default view - lists all model items - has shared view cms/view/shared/list.html
	*/
	public function index(){
	  
    WaxEvent::run("cms.index.all", $this);
	}

	public function create(){
	  $model = new $this->model_class();
	  if($model->save()) $this->redirect_to("/".trim($this->controller,"/")."/edit/".$model->primval."/");
	}

	public function edit(){
	  $this->model = new $this->model_class(Request::get("id"));
	  $this->form = new WaxForm($this->model);
	  //check for join to users
	  if($this->model->columns['author']) $this->form->author->value = $this->current_user->primval;
    //run the save event	  
	  WaxEvent::run("cms.save", $this);
	}

  public function copy(){
    $this->use_layout = $this->use_view = false;
    $source_model = new $this->model_class(Request::param("source"));
    $destination_model = $source_model->copy();
    if($changes = Request::param('change')) $destination_model->update_attributes($changes);
    $this->redirect_to("/".trim($this->controller,"/")."/edit/".$destination_model->primval."/");
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


  public function save_before(){}
  public function save_after(){}  
  public function save_success(){}  

}
?>
