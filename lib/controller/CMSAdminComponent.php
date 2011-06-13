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

  public $autosave = false;

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
      $mods = CMSApplication::get_modules();
      $obj->quick_links = array("create new ".$mods[$obj->module_name]['display_name']=>'/admin/'.$obj->module_name."/create/", 'manage files'=>"/admin/files/");
    });
    /**
     * permissions
     */
    WaxEvent::add("cms.permission.check_action", function() {
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
     * joins such as categories are handled by this function
     * - the join post array is key value where the key is the join name (ie categories) and
     *   the value is an array of data
     * - first thing we do is remove all the joins for the join you are posting
     *   and then re join to the data in the array that is set
     * this allows for 0 based values to be posted to remove the join
     */
    WaxEvent::add("cms.joins.handle", function(){
      $obj = WaxEvent::data();
	    $saved = $obj->model;
      if(isset($_REQUEST['joins'])){
        foreach($_REQUEST['joins'] as $join=>$values){
          $class = $saved->columns[$join][1]['target_model'];
          if($j = $saved->$join) $saved->$join->unlink($j);
          foreach($values as $id=>$v) if(is_array($v) && $v['id']){
            $target = new $class($v['id']);
            foreach((array)$v['extra_fields'] as $extra_field => $extra_value)
              $target->$extra_field = $extra_value;
            $saved->$join = $target;
          }elseif($v) $saved->$join = new $class($v);
        }
      }
    });
    WaxEvent::add('cms.file.tag', function(){
      $obj = WaxEvent::data();
      $tags = Request::param('tags');
      foreach((array)$tags as $fileid=>$tag_order){
        if($tag_order['tag'] && isset($tag_order['join_order'])) $obj->model->file_meta_set($fileid, $tag_order['tag'], $tag_order['join_order'], $tag_order['title']);
      }
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
    WaxEvent::add("cms.save.success", function(){
      $obj = WaxEvent::data();
      WaxEvent::run('cms.joins.handle', $obj);
      WaxEvent::run('cms.file.tag', $obj);
    });

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
	  
	  WaxEvent::add("cms.model.copy", function(){
	    $obj = WaxEvent::data();
	    $destination_model = $obj->source_model->copy();
      if($changes = Request::param('change')) $destination_model->update_attributes($changes);
      $this->redirect_to("/".trim($this->controller,"/")."/edit/".$destination_model->primval."/");
	  });
	  
	  
	  WaxEvent::add('cms.file.old_upload', function(){
      $obj = WaxEvent::data();
      if(($up = $_FILES['upload']) && ($up['name']) && ($dir=Request::param('path'))){
        $path = PUBLIC_DIR.$dir;
        $safe_name = File::safe_file_save($path, $up['name']);
        move_uploaded_file($up['tmp_name'], $path.$safe_name);
        exec("chmod -Rf 0777 ".$path.$safe_name);
        $obj->sync($dir);
      }
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

  public function _list(){
    if($this->use_format == "ajax") $this->index();
  }
  
  public function _filter_inline(){
    $this->results = array();
    if($this->use_format == "ajax" && ($filters = Request::param('inline_filter') ) && ($search_class = Request::param('search_model'))){
      $filter = array_shift($filters);
      $this->type = Request::param("type");
      $search_model = new $search_class($this->type);
      $this->results = $search_model->filter($search_model->identifier ." LIKE '$filter%'")->all();
      $model_class = Request::param('origin_model');
      $primval = Request::param('origin_primval');
      $this->model = new $model_class($primval);
      $this->name = Request::param("name");      
    }
  }

	public function create(){
	  $model = new $this->model_class();
	  $cachelink = Config::get('cacheissue');
	  $model->validation_groups = array("skip_validation"); //put this in to be able to create "empty" cms models
	  if($model->save()) $this->redirect_to("/".trim($this->controller,"/")."/edit/".$model->primval."/".(($cachelink)?"?r=".rand():""));
	}

	public function edit(){
	  WaxEvent::run("cms.form.setup", $this);
	  WaxEvent::run("cms.edit.init", $this);
	  WaxEvent::run('cms.file.old_upload', $this);
    //run the save event
	  WaxEvent::run("cms.save", $this);
	}

  public function copy(){
    $this->use_layout = $this->use_view = false;
    $this->source_model = new $this->model_class(Request::param("source"));
    WaxEvent::run("cms.model.copy", $this);
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
    @chmod($path.$filename, 0777);
    $this->sync($rpath);
    sleep(1);
  }


  public function _existing_files(){
    if($this->use_format == "ajax"){
      $this->use_format = "html";
      $this->model = new $this->model_class(Request::param('id'));
    }
  }
  public function _file_list(){
    $this->exising = $this->files = array();
	  if($this->dir = Request::param('dir')){
	    $file = new $this->file_system_model("available");
	    $this->model = new $this->model_class(Request::param('id'));
	    foreach($this->model->files as $f) $this->existing[] = $f->rpath.$f->filename;
	    if(!is_dir(PUBLIC_DIR . $this->dir)) mkdir(PUBLIC_DIR . $this->dir, 0777, true);
	    $this->files = array_reverse(scandir(PUBLIC_DIR . $this->dir));
	  }
  }
  public function _file_info(){
	  if($filename = Request::param('file')){
	    $model = new $this->model_class(Request::param('id'));
	    $file = new $this->file_system_model("available");
	    $base = basename($filename);
	    $path = str_replace($base, "", $filename);
      $this->file = $file->filter("rpath", $path)->filter("filename", $base)->first();
      $this->exists= false;
      foreach($model->files as $f) if($f->primval == $this->file->primval) $this->exists=true;
	  }
	}



}
?>
