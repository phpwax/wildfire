<?php
/**
* Content Controller
* @package PHP-WAX CMS
*/
class CMSAdminContentController extends AdminComponent {
	public $module_name = "content";
	public $model_class = 'WildfireContent';
	public $display_name = "Content";
  public $per_page = false; //not paginated, instead using roots of the tree to start and filters afterwards
	public $filter_fields=array(
                          'text' => array('columns'=>array('title'), 'partial'=>'_filters_text', 'fuzzy'=>true),
                          'parent' => array('columns'=>array('parent_id'), 'partial'=>'_filters_parent'),
                          'language' => array('columns'=>array('language'), 'partial'=>"_filters_language")
	                      );
  //throw in a new scaffold that doesnt exist
  public $scaffold_columns = array('view_children'=>true);

	protected function events(){
	  parent::events();

	  WaxEvent::add("cms.url.delete", function(){
	    if(($id = Request::param('map_remove')) && ($check = new WildfireUrlMap($id)) && $check->primval){
	      Session::add_message($check->origin_url.' has been deleted.');
	      $check->delete();
      }
	  });

	  WaxEvent::add('cms.url.add', function(){
	    $obj = WaxEvent::$data;
	    $saved = $obj->model;
	    $class = get_class($saved);
	    $primval = $saved->primval;
	    //if its a revision, status should be hidden
      if($revision = $saved->revision()) $status = 0;
      else $status = $saved->status;
      if($maps = Request::param('url_map')){
        $map_model = new WildfireUrlMap;
        foreach($maps as $map_id=>$permalink){
         $link = "/".trim($permalink,"/")."/";
         if(!is_numeric($map_id) && strlen($permalink)){
           $to_save = new WildfireUrlMap;
           if($map_model->clear()->filter("origin_url", $link)->first()) Session::add_error('Cannot add url ('.$link.'), it is already in use');
           else if($newmap = $to_save->map_to($link, $saved, $primval, $status) ) Session::add_message($link.' has been added to your urls.');
         }
        }
      }

	  });
    /**
     * joins such as categories are handled by this funciton
     * - the join post array is key value where the key is the join name (ie categories) and
     *   the value is an array of data
     * - first thing we do is remove all the joins for the join you are posting
     *   and then re join to the data in the array that is set
     * this allows for 0 based values to be posted to remove the join
     */
    WaxEvent::add("cms.joins.handle", function(){
      $obj = WaxEvent::$data;
	    $saved = $obj->model;
      if(isset($_REQUEST['joins'])){
        foreach($_REQUEST['joins'] as $join=>$values){
          $saved->$join->unlink($saved->$join);
          foreach($values as $id=>$v){
            $class = $saved->columns[$join][1]['target_model'];
            if($v) $saved->$join = new $class($id);
          }
        }
      }
    });
    /**
     * a sanity check to stop recursive loops on trees - not used at the moment, disabled
     * - if the parent of the model has the model as its parent change the parent to avoid infinite loop
     * the front end shouldnt allow this, but check for it incase someone does something insane
     */
    WaxEvent::add("cms.save.sanity_check", function(){
      $obj = WaxEvent::$data;
      //if old parent doesnt match the new parent then check for weirdness
      if($obj->model->parent_id != $obj->old_parent_id){
        $old_parent = new $obj->model_class($obj->old_parent_id);
        $new_parent = new $obj->model_class($obj->model->parent_id);
        //if the parents parent is the model, then fix that by setting the new parents id to the old parent 
        if($new_parent->parent_id == $obj->model->primval) $new_parent->update_attributes(array('parent_id'=>0));
        
      }
    });
	  //overwrite existing events - handle the revision change
	  WaxEvent::add("cms.save.before", function(){
	    $obj = WaxEvent::$data;
	    $obj->old_parent_id = $obj->model->parent_id;
	    if(Request::param('revision')){
	      $obj->master = $obj->model;
  	    $obj->model = $obj->model->copy();
  	    $obj->form = new WaxForm($obj->model);
      }
    });
    //if the model is a revision or alt language dont let them edit the parent as this would break the nav
    WaxEvent::add("cms.form.setup", function(){
      $obj = WaxEvent::$data;
      WaxEvent::run('cms.url.delete', $obj);
    });
    
    //status changing after save
    WaxEvent::add("cms.save.success", function(){
	    $obj = WaxEvent::$data;
      // 
      if(Request::param('live')) $obj->model->generate_permalink()->map_live()->children_move()->show()->save();
      elseif(Request::param('hide')) $obj->model->generate_permalink()->map_hide()->hide()->save();
      elseif(Request::param('revision')){
        $obj->model->generate_permalink()->hide()->update_attributes(array('revision'=>Request::param('id')))->map_revision();
      }
      //look for url map saves
	    WaxEvent::run('cms.url.add', $obj);
	    //generic join handling
	    WaxEvent::run('cms.joins.handle', $obj);
	    //checking for cicular references..
	    WaxEvent::run("cms.save.sanity_check", $obj);
  	  if($obj->use_layout) $obj->redirect_to("/".trim($obj->controller,"/")."/edit/".$obj->model->primval."/");
    });
    //modify the post filter function to enforce a status filter - they bubble..
    WaxEvent::add("cms.model.filters", function(){
      $obj = WaxEvent::$data;
      if(!isset($obj->model_filters['language']) && $obj->model && $obj->model->columns['language']){
        $obj->model_filters['language'] = array_shift(array_keys($obj->model->columns['language'][1]['choices']));
        $obj->model->filter("language",  $obj->model_filters['language']);
      }
    });

    WaxEvent::clear("cms.index.setup");
    WaxEvent::add("cms.index.setup", function(){
	    $obj = WaxEvent::$data;
	    //if the parent filter isn't set, then
	    if(!strlen($obj->model_filters['parent'])) $obj->cms_content = $obj->model->filter('revision',0)->roots();
	    else $obj->cms_content = $obj->model->all();
    });    
	}

	protected function initialise(){
	  parent::initialise();
    WaxEvent::run("cms.model.tree",$this);
	}

  public function _parent(){
    if($this->use_format == "ajax"){
      $this->model_tree = array();
      $this->model = new $this->model_class(Request::param('model'));
      $this->base = new $this->model_class(Request::param('base'));
      $model = new $this->model_class(Request::param('id'));
      $this->tree = $model->children;
      $this->depth = Request::param('depth');
      foreach($this->base->tree() as $node) $this->model_tree[] = $node->primval;
      $this->use_format = "html";
    }
  }

  public function _list(){
    if($this->use_format == "ajax") $this->index();
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
	    $file = new WildfireFile("available");
	    $this->model = new $this->model_class(Request::param('id'));
	    foreach($this->model->files as $f) $this->existing[] = $f->rpath.$f->filename;
	    $this->files = array_reverse(scandir(PUBLIC_DIR . $this->dir));
	  }
  }
  public function _file_info(){
	  if($filename = Request::param('file')){
	    $model = new $this->model_class(Request::param('id'));
	    $file = new WildfireFile("available");
	    $base = basename($filename);
	    $path = str_replace($base, "", $filename);
      $this->file = $file->filter("rpath", $path)->filter("filename", $base)->first();
      $this->exists= false;
      foreach($model->files as $f) if($f->primval == $this->file->primval) $this->exists=true;
	  }
	}




}
?>
