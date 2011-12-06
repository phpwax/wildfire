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
      if($obj->sortable) $obj->quick_links["Sort ".$mods[$obj->module_name]['display_name']] = '/admin/'.$obj->module_name."/sort/";
      if($obj->exportable) $obj->quick_links["Export ".$mods[$obj->module_name]['display_name'] ." as csv"] = '/admin/'.$obj->module_name."/export.".(($obj->export_group) ? "zip" : "csv");
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
      if(!$obj->current_user = $obj->user_from_session($obj->user_session_var_name)) $obj->redirect_to($obj->redirects['unauthorised']);
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
            elseif($filter['fuzzy_right']) $col_filter .= "`$col` LIKE '".($value)."%' OR";
            elseif($filter['fuzzy_left']) $col_filter .= "`$col` LIKE '%".($value)."' OR";
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
          foreach($values as $id=>$v){
            if(is_array($v)){
              if($v['id']){
                $target = new $class($v['id']);
                foreach((array)$v['extra_fields'] as $extra_field => $extra_value) $target->$extra_field = $extra_value;
                $saved->$join = $target;
              }
            }elseif($v) $saved->$join = new $class($v);
          }
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
      $index_model = clone $obj->model;
      if($index_model->columns["date_modified"]) $index_model->order("date_modified DESC");
      $obj->cms_content = $index_model->page($obj->this_page, $obj->per_page);
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
	      if($obj->use_layout) $obj->add_message("Saved.", "confirm");
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

	  WaxEvent::add("cms.tree.setup", function(){
      $controller = WaxEvent::data();
      $controller->tree_model = clone $controller->model;
      if($controller->model_filters['parent']){
        $controller->load_whole_tree = false;
      }
    });

    WaxEvent::add("cms.sort.all", function(){
      $controller = WaxEvent::data();
      if($sort = Request::param('sort')){
        foreach($sort as $id=>$pos){
          $model = new $controller->model_class($id);
          $model->update_attributes(array("sort"=>$pos));
        }
      }
    });

    WaxEvent::add("cms.export.init", function(){
      $controller = WaxEvent::data();
      $model_class = $controller->model_class;
      $controller->cols = array();
      $model = new $model_class;
      foreach($model->columns as $col=>$info) if($info[1] && $info[1]['export']) $controller->cols[] = $col;

      if($controller->exportable && !$controller->export_group){
        $controller->model = new $model_class($controller->export_scope);
  	    WaxEvent::run("cms.model.filters", $controller);
      }elseif($controller->export_group){
        //if its an export group, then we find each instance of the column
        $model = new $model_class($controller->export_scope);
        $groups = array();
        foreach($model->group($controller->export_group)->all() as $r) $groups[] = $r->{$controller->export_group};
        //now we make a tmp dir
        $folder = WAX_ROOT."tmp/export/";
        $hash = date("Ymdhis");
        mkdir($folder.$hash, 0777, true);
        //now we render the export as a partial per group and save to a file
        foreach($groups as $g){
          $model = new $model_class($controller->export_scope);
          $model = $model->filter($controller->export_group, $g);
          $res = partial("shared/_export", array('model'=>$model, 'cols'=>$controller->cols), "csv");
          $file = $folder .$hash. "/".Inflections::to_url($g).".csv";        
          file_put_contents($file, $res);          
        }
        //afterwards, create zip
        $cmd = "cd ".$folder." && zip -j ".$hash.".zip $hash/*";
        exec($cmd);      
        $content = "";
        if(is_file($folder.$hash.".zip") && ($content = file_get_contents($folder.$hash.".zip"))){
          $name = str_replace("/", "-", $controller->controller). "-".date("Ymdh").".zip";
  	      header("Content-type: application/zip");
          header("Content-Disposition: attachment; filename=".$name);
          header("Pragma: no-cache");
          header("Expires: 0");          
        }
        //tidy up
        unlink($folder.$hash.".zip");
        foreach(glob($folder.$hash."/*") as $f) unlink($f);
        rmdir($folder.$hash);
        
        echo $content;
        exit;
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

  public function sort(){
    WaxEvent::run("cms.form.setup", $this);
	  WaxEvent::run("cms.edit.init", $this);
	  WaxEvent::run("cms.sort.all", $this);
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
    //setup incoming data
    if(!$this->inline_filters) $this->inline_filters = Request::param('inline_filter');
    if(!$this->name) $this->name = Request::param("name");
    if(!$this->filter_type) $this->filter_type = Request::param("type");

    if(!$this->search_class) $this->search_class = Request::param('search_model');
    if(!$this->search_model && $this->search_class) $this->search_model = new $this->search_class($this->filter_type);
    

    if(!$this->origin_class) $this->origin_class = Request::param('origin_model');
    if(!$this->origin_primval) $this->origin_primval = Request::param('origin_primval');
    if(!$this->origin_model && $this->origin_class && $this->origin_primval) $this->origin_model = new $this->origin_class($this->origin_primval);
    if(!$this->origin_col && $this->name && $this->origin_model) $this->origin_col = $this->origin_model->get_col($this->name);

    //get existing joins
    $this->existing = array();
    if($this->origin_model){
      if($this->filter_type == "multipleselect"){
        $this->origin_col->eager_loading = 1;
        foreach($this->origin_col->get() as $r)
          $this->existing[$r->primval] = $r->{$this->origin_col->join_order};
      }else $this->existing[$this->origin_model->{$this->name}->primval] = 0;
    }

    //apply filters if needed
    if($this->inline_filters){
      $filter = "{$this->search_model->identifier} LIKE '".array_shift($this->inline_filters)."%'";
      if($this->existing)
        $this->search_model->filter("($filter OR {$this->search_model->primary_key} IN(".implode(",", array_fill(0, count($this->existing), "?"))."))", array_keys($this->existing))->all();
      else $this->search_model->filter($filter);
    }

    $this->results = $this->search_model?$this->search_model->scope($this->filter_type)->all():array();

    //order joined items to come out first, and to be ordered by their column's join_order if it's set
    $existing = $this->existing;
    $order_col = $this->search_model->identifier;
    usort($this->results->rowset, function($a, $b) use ($existing, $order_col){
      $ak = array_key_exists($a['id'], $existing);
      $bk = array_key_exists($b['id'], $existing);

      if($ak && $bk) return ($existing[$a['id']] < $existing[$b['id']]) ? -1 : 1; //both are joined, then sort on join_order
      if(!$ak && !$bk){
        if($a[$order_col] < $b[$order_col]) return -1;
        else return 1;
      }
      return ($ak > $bk) ? -1 : 1; //one is joined and the other isn't, sort with joined first
    });

  }

	public function create(){
	  $model = new $this->model_class();
	  $cachelink = Config::get('cacheissue');
	  $model->validation_groups = array("skip_validation"); //put this in to be able to create "empty" cms models
	  if($data = Request::param($model->table)) $model->set_attributes($data);
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

  public function _tree(){
    WaxEvent::run("cms.tree.setup", $this);
    if($this->use_format == "ajax"){
      $this->use_view = "_tree_nodes";
      $this->use_format = "html";
    }
  }

  public function export(){
    WaxEvent::run("cms.form.setup", $this);
	  WaxEvent::run("cms.edit.init", $this);
	  WaxEvent::run("cms.export.init", $this);
  }
  public function _export(){$this->use_view = "export";}

}
?>
