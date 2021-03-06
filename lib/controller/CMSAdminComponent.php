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
  public $tree_layout = false;
  public $current_user=false; //the currently logged in
  //filter details
  public $filter_partial="_filters";
  public $filter_fields=array(
                          'text' => array('columns'=>array('title'), 'partial'=>'_filters_text', 'fuzzy'=>true)
                        );
  public $dashboard = true;
  public $model_search_scope = false;
  //used to tag images on joins
  public $file_tags = array('image', 'document');

  public $autosave = false;
  //helper array to check what has help files made for it.
  public $has_help = array();
  public $multipleselect_scope = "multipleselect";
  public $show_analytics = false;
  //check user is allowed to do this!
  public function controller_global(){
    parent::controller_global();
    WaxEvent::run("cms.permission.check_action", $this);
  }

  protected function events(){
    parent::events();
    WaxEvent::add("cms.duplicate.unsets", function(){
      $controller = WaxEvent::data();
      unset($controller->columns['id']);
    });
    WaxEvent::clear("cms.layout.set");

    WaxEvent::add("cms.layout.set", function(){
      $obj = WaxEvent::data();
      $obj->use_layout = "admin";

    });
    WaxEvent::add("cms.layout.sublinks", function(){
      $obj = WaxEvent::data();
      $mods = CMSApplication::get_modules();
      $obj->quick_links = array("new"=>'/admin/'.$obj->module_name."/create/");
      if($obj->sortable) $obj->quick_links["sort"] = '/admin/'.$obj->module_name."/sort/";
      if($obj->exportable) $obj->quick_links["export"] = '/admin/'.$obj->module_name."/export.".(($obj->export_group) ? "zip" : "csv");
    });


    WaxEvent::add("cms.search", function(){
      $obj = WaxEvent::data();
      if($search = Request::param('term')){
        $obj->search_term = $search;
        $model = new $obj->model_class;
        $obj->search_results = $model->scope($obj->model_search_scope)->filter("title LIKE '%$search%'")->limit(5)->all();
      }
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
      if($obj->model->columns['author'] && ($col = $obj->model->columns['author'][1]['col_name'])) $obj->model->$col = $obj->current_user->primval;
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
            if($opp = $filter['opposite_join_column']){
              $target = $obj->model->columns[$col][1]['target_model'];
              $join = new $target($value);
              $ids = array();
              foreach($join->$opp as $opposite) $ids[] = $opposite->primval;
              $col_filter .= "(`".$obj->model->primary_key."` IN(".implode(",",$ids).")) OR";
            }
            elseif($filter['fuzzy']) $col_filter .= "`$col` LIKE '%".($value)."%' OR";
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

    WaxEvent::add("cms.file.upload", function(){
      list($filename, $file_type, $data, $media_class, $event_timestamp) = WaxEvent::data();
      if($filename && $data){
        //from the file name find the extension
        $ext = (substr(strrchr($filename,'.'),1));
        $check = strtolower($ext);
        //find the class associated with that file
        $setup = WildfireMedia::$allowed;
        if($setup && ($class= $setup[$check])){
          //save the file somewhere
          $path = PUBLIC_DIR. "files/".date("Y-m-W")."/";
          if(!is_dir($path)) mkdir($path, 0777, true);
          $filename = File::safe_file_save($path, $filename);
          file_put_contents($path.$filename, $data);
          //now we make a new media item
          $model = new $media_class;
          $vars = array('title'=>basename($filename, ".".$ext),
                        'file_type'=>$file_type,
                        'status'=>0,
                        'media_class'=>$class,
                        'uploaded_location'=>str_replace(PUBLIC_DIR, "", $path.$filename),
                        'hash'=>hash_hmac('sha1', $data, md5($data)),
                        'ext'=>$ext,
                        'event_timestamp'=>$event_timestamp
                        );
          if($saved = $model->update_attributes($vars)){
            $obj = new $class;
            $obj->set($saved);
            WaxEvent::run("cms.file.uploaded", $saved);
          }
        }
      }
    });

    WaxEvent::add("cms.xhr.upload", function(){
      $obj = WaxEvent::data();
      if($filename = $_SERVER['HTTP_X_FILE_NAME']){
        $data = array($filename, $_SERVER['HTTP_X_FILE_TYPE'], file_get_contents("php://input"), $obj->file_system_model, $_SERVER['HTTP_X_FILE_EVENTTIMESTAMP']);
      }elseif(($up = $_FILES['upload']) && ($up['name'])){
        $data = array($up['name'], $up['type'], file_get_contents($up['tmp_name']), $obj->file_system_model, param("category"));
      }
      if($data) WaxEvent::run("cms.file.upload", $data);
    });

    WaxEvent::add("cms.file.download", function(){

      $obj = WaxEvent::data();
      $obj->model = new $obj->model_class(Request::get("id"));

      File::stream_file(PUBLIC_DIR.$obj->model->source);

    });

    /**
     * view setups
     */
    WaxEvent::add("cms.index.setup", function(){
      $obj = WaxEvent::data();
      $index_model = clone $obj->model;
      if($index_model->columns["date_modified"]) $index_model->order("date_modified DESC");
      if($obj->per_page !== false) $obj->cms_content = $index_model->page($obj->this_page, $obj->per_page);
      else $obj->cms_content = $index_model->all();
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
      $obj->redirect_to("/".trim($obj->controller,"/")."/edit/".$destination_model->primval."/");
    });


   // WaxEvent::add('cms.file.old_upload', function(){
   //    $obj = WaxEvent::data();
   //    if(($up = $_FILES['upload']) && ($up['name']) && ($dir=Request::param('path'))){
   //      $path = PUBLIC_DIR.$dir;
   //      $safe_name = File::safe_file_save($path, $up['name']);
   //      move_uploaded_file($up['tmp_name'], $path.$safe_name);
   //      exec("chmod -Rf 0777 ".$path.$safe_name);
   //      $obj->sync($dir);
   //    }
   //  });

    WaxEvent::add("cms.tree.setup", function(){
      $controller = WaxEvent::data();
      $controller->tree_model = clone $controller->model;
      if($controller->model_filters['parent']){
        $controller->load_whole_tree = false;
      }
      $controller->tree_model->enable_has_child_query();
    });

    WaxEvent::add("cms.sort.all", function(){
      $controller = WaxEvent::data();
      if($controller->tree_layout) $controller->model->enable_has_child_query();
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
          WaxEvent::run("cms.model.groupfilters", $model);
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
    if(Request::param("use_view") && !empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest') {
      $this->use_layout = false;
      $this->use_format = "ajax";
      $this->use_view = Request::param("use_view");
    }
    WaxEvent::run("cms.index.setup", $this);
  }
  public function _dashboard(){
    $this->per_page = 5;
    WaxEvent::run("cms.index.setup", $this);
    if($this->tree_layout && ($parent = $this->current_user->restricted_tree($this->model_class))){
      if(!$pid[1]) $pid[1] = "id";
      if($pid[0]) $this->cms_content = $this->cms_content->filter($pid[1], $pid[0]);
      if($this->per_page !== false) $this->cms_content = $this->cms_content->page($this->this_page, $this->per_page);
      else $this->cms_content = $this->cms_content->all();
    }

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
      $filter = "{$this->search_model->identifier} LIKE '%".array_shift($this->inline_filters)."%'";
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
    WaxEvent::run("cms.xhr.upload", $this);
    //WaxEvent::run('cms.file.old_upload', $this);
    //run the save event
    WaxEvent::run("cms.save", $this);
  }

  public function upload(){
    $this->use_layout = $this->use_view = false;
    WaxEvent::run("cms.xhr.upload", $this);
    if($_FILES) $this->redirect_to($this->referrer); //redirect back to the page for old style form uploads
  }
  public function download(){
    $this->use_view = false;
    WaxEvent::run("cms.file.download", $this);
  }

  public function file_check(){
    $this->use_view = $this->use_layout = false;
    if($filename = Request::param('filename')){
      $ext = strtolower(substr(strrchr($filename,'.'),1));
      $setup = WildfireMedia::$allowed;
      if($setup && $setup[$ext]) echo json_encode(array("status"=>200, 'error'=>''));
      else echo json_encode(array('error'=>'No support for this file type', 'status'=>500));
    }else{
      echo json_encode(array('error'=>'No file', 'status'=>500));
    }
  }

  public function media_name() {
    $this->use_view = $this->use_layout = false;
    $media = new WildfireMedia;
    $media->name_event(post("timestamp"), post("event_name"));
  }


  public function copy(){
    $this->use_layout = $this->use_view = false;
    $this->source_model = new $this->model_class(Request::param("source"));
    WaxEvent::run("cms.model.copy", $this);
  }


  public function _tree(){
    WaxEvent::run("cms.tree.setup", $this);
    if($this->use_format == "ajax"){
      $this->use_view = "_tree_nodes";
      $this->use_format = "html";
    }
  }

  public function _tree_nodes(){
    if($this->run_setup) WaxEvent::run("cms.tree.setup.children", $this);

  }

  public function export(){
    WaxEvent::run("cms.form.setup", $this);
    WaxEvent::run("cms.edit.init", $this);
    WaxEvent::run("cms.export.init", $this);
  }
  public function _export(){$this->use_view = "export";}

  public function search(){
    WaxEvent::run("cms.search", $this);
  }


  public function duplicate(){
    $class = $this->model_class;
    $model = new $class(Request::param("id"));
    $new_version = new $class;
    $this->columns = $model->columns;
    WaxEvent::run("cms.duplicate.unsets", $this);

    $new_version->status = $new_version->revision = 0;
    foreach($this->columns as $col=>$setup) {
      $field = $model->get_col($col);
      if(!$field->is_association) $new_version->$col = $model->$col;
      elseif($setup[0] != "HasManyField") $associations[]=$col;
    }

    if($saved = $new_version->hide()->save()){
      foreach($associations as $col) $new_version->$col = $model->$col;
      $this->session->add_message('Item has been duplicated, you can edit it below.');
      $this->redirect_to("/".$this->controller."/edit/".$new_version->primval);
    }

    $this->session->add_error('Item duplication failed.');
    $this->redirect_to("/".$this->controller."/");

  }

  public function status_toggle(){
    $this->use_view = "edit";
    $class = $this->model_class;
    $model = new $class(Request::param("id"));
    if($model->columns['status']){
      if($model->status) $model->update_attributes(array('status'=>0));
      else $model->update_attributes(array('status'=>1));
    }else throw new Exception("No status to change");
  }

}
?>