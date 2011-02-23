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
  
  public $dashboard = true;
  //used to tag images on joins
  public $file_tags = array('image', 'document');
  
  //check user is allowed to do this!
  public function controller_global(){
    parent::controller_global();
    WaxEvent::run("cms.permission.check_action", $this);
  }

  protected function events(){
    parent::events();
    WaxEvent::clear("cms.layout.set");
    
    WaxEvent::add("cms.layout.set", function(){
      $obj = WaxEvent::data();
  	  $obj->use_layout = "admin";
    });
    WaxEvent::add("cms.layout.sublinks", function(){
      $obj = WaxEvent::data();
      $obj->quick_links = array("create new $obj->module_name"=>'/admin/'.$obj->module_name."/create/", 'manage files'=>"/admin/files/");
    });
    /**
     * permissions
     */
    WaxEvent::add("cms.permissions.check_action", function() {
      $obj = WaxEvent::data();
      if(!$obj->current_user->allowed($obj->module_name, $obj->action)) $obj->redirect_to($obj->redirects['unauthorised']);
    });
    
    WaxEvent::add("cms.permissions.logged_in_user", function() {
      $obj = WaxEvent::data();
      if(!$obj->current_user = $obj->user_from_session($obj->user_session_name)) $obj->redirect_to($obj->redirects['unauthorised']);
    });
	  WaxEvent::add("cms.permissions.all_modules", function(){
	    $obj = WaxEvent::data();
	    foreach(CMSApplication::get_modules() as $name=>$info){
	      $class = "CMSAdmin".Inflections::camelize($name,true)."Controller";
	      if($obj->current_user->allowed($name, "index")) $obj->allowed_modules[$name] = $info;
	    }
    });
    /** 
     * models
     */
    WaxEvent::add("cms.model.init", function(){
      $obj = WaxEvent::data();
      $obj->model = new $obj->model_class($obj->model_scope);
    });
    WaxEvent::add("cms.pagination", function(){
      $obj = WaxEvent::data();
	    if($pg = Request::param('page')) $obj->this_page = $pg;
      if($pp = Request::param('per_page')) $obj->per_page = $pp;
	  });
	  
    WaxEvent::add("cms.model.filters", function(){
      $obj = WaxEvent::data();
      if(!$obj->model_filters) $obj->model_filters = Request::param('filters');
      $filterstring = "";
      
      foreach((array)$obj->model_filters as $name=>$value){
        $col_filter = "";
        if(strlen($value) && $filter = $obj->filter_fields[$name]){
          foreach($filter['columns'] as $col){
            if($filter['fuzzy']) $col_filter .= "`$col` LIKE '%".($value)."%' OR";
            else $col_filter .= "`$col`='".($value)."' OR";
          }
          $filterstring .= "(".trim($col_filter, " OR").") AND ";
        }
      }
      if($filterstring) $obj->model->filter(trim($filterstring, " AND "));
    });
    
	  WaxEvent::add("cms.model.columns", function(){
	    $obj = WaxEvent::data();
      $model = new $obj->model_class;
      foreach($model->columns as $col=>$info) if($info[1]['scaffold']) $obj->scaffold_columns[$col] = true;
	  });
	  
	  WaxEvent::add("cms.model.setup", function(){
	    $obj = WaxEvent::data();
	    WaxEvent::run("cms.model.init", $obj);
	    WaxEvent::run("cms.pagination", $obj);
	    WaxEvent::run("cms.model.columns", $obj);
	    WaxEvent::run("cms.model.filters", $obj);	    
	  });
	  /**
	   * forms
	   */
	  WaxEvent::add("cms.form.setup", function(){
	    $obj = WaxEvent::data();
	    $obj->model = new $obj->model_class(Request::get("id"));
  	  $obj->form = new WaxForm($obj->model);
  	  //check for join to users
  	  if($obj->model->columns['author']) $obj->form->author->value = $obj->current_user->primval;
	  });
	  
    /**
     * view setups
     */
    WaxEvent::add("cms.index.setup", function(){
      $obj = WaxEvent::data();
      $obj->cms_content = $obj->model->page($obj->this_page, $obj->per_page);
    });

    WaxEvent::add("cms.save.before", function(){});    
    WaxEvent::add("cms.save.after", function(){});
    WaxEvent::add("cms.save.success", function(){});
    
    WaxEvent::add("cms.save", function(){
	    $obj = WaxEvent::data();
	    WaxEvent::run("cms.save.before", $obj);
	    if($obj->saved = $obj->form->save()){
	      if($obj->use_layout) Session::add_message('Saved.');
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
    parent::initialise();
    WaxEvent::run("cms.permissions.logged_in_user", $this);
	  WaxEvent::run("cms.permissions.all_modules", $this);
    WaxEvent::run("cms.model.setup", $this);    
    WaxEvent::run("cms.format.set",$this);
	}


	/**
	* Default view - lists all model items - has shared view cms/view/shared/list.html
	*/
	public function index(){
    WaxEvent::run("cms.index.setup", $this);
	}

	public function create(){
	  $model = new $this->model_class();
	  if($model->save()) $this->redirect_to("/".trim($this->controller,"/")."/edit/".$model->primval."/");
	}

	public function edit(){
	  WaxEvent::run("cms.form.setup", $this);	  
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


  public function upload(){
    $this->use_view= false;
    $rpath = $_SERVER['HTTP_X_FILE_PATH'];
    $path = PUBLIC_DIR. $rpath;
    $filename = File::safe_file_save($path, $_SERVER['HTTP_X_FILE_NAME']);
    $putdata = fopen("php://input", "r");
    $put = "";
    while ($data = fread($putdata, 2048)) $put .= $data;
    file_put_contents($path.$filename, $put);
    chmod($path.$filename, 0777);
    $this->sync($rpath);
    sleep(1);
    $model = new WildfireFile;
    if($found = $model->filter('rpath', $rpath)->filter('filename',$filename)->all()){
      if(($id = $_SERVER['HTTP_X_PRIMVAL']) && ($class = $_SERVER['HTTP_X_CLASS'])){
        $content = new $class($id);
        foreach($found as $f) $content->files = $f;
      }
    }
  }

}
?>
