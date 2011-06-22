<?php
/**
* Content Controller
* @package PHP-WAX CMS
*/
class CMSAdminContentController extends AdminComponent {
	public $module_name = "content";
	public $model_class = 'WildfireContent';
	public $model_scope = 'admin';
	public $display_name = "Content";
  public $per_page = false; //not paginated, instead using roots of the tree to start and filters afterwards
	public $filter_fields=array(
                          'text' => array('columns'=>array('title'), 'partial'=>'_filters_text', 'fuzzy'=>true),
                          'parent' => array('columns'=>array('parent_id'), 'partial'=>'_filters_parent'),
                          'language' => array('columns'=>array('language'), 'partial'=>"_filters_language")
	                      );
  //throw in a new scaffold that doesnt exist
  public $scaffold_columns = array('view_children'=>true);
  public $autosave = true;
  

	protected function events(){
	  parent::events();

	  WaxEvent::add("cms.url.delete", function(){
	    if(($id = Request::param('map_remove')) && ($check = new WildfireUrlMap($id)) && $check->primval){
	      WaxEvent::data()->session->add_message($check->origin_url.' has been deleted.');
	      $check->delete();
      }
	  });

	  WaxEvent::add('cms.url.add', function(){
	    $obj = WaxEvent::data();
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
           if($map_model->clear()->filter("origin_url", $link)->first()) $obj->session->add_error('Cannot add url ('.$link.'), it is already in use');
           else if($newmap = $to_save->map_to($link, $saved, $primval, $status) ) $obj->session->add_message($link.' has been added to your urls.');
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
      $obj = WaxEvent::data();;
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
	    $obj = WaxEvent::data();;
	    $obj->old_parent_id = $obj->model->parent_id;
	    if(Request::param('revision')){
	      $obj->master = $obj->model;
	      if($saved = $obj->model->save()) $obj->model = $saved->copy();
	      else{
	        WaxLog::log('error', print_r($obj->model,1), 'save_errors');
	        $obj->session->add_error("Failed!");
	        $obj->redirect_to("/".trim($obj->controller,"/")."/");
	      }
  	    $obj->form = new WaxForm($obj->model);
      }
    });
    //if the model is a revision or alt language dont let them edit the parent as this would break the nav
    WaxEvent::add("cms.form.setup", function(){
      $obj = WaxEvent::data();
      WaxEvent::run('cms.url.delete', $obj);
    });

    WaxEvent::clear("cms.save.success");
    //status changing after save
    WaxEvent::add("cms.save.success", function(){
	    $obj = WaxEvent::data();
      //
      if(Request::param('live')) $obj->model->generate_permalink()->map_live()->children_move()->show()->save();
      elseif(Request::param('hide')) $obj->model->generate_permalink()->map_hide()->hide()->save();
      elseif(Request::param('revision')) $obj->model->generate_permalink()->hide()->update_attributes(array('revision'=>Request::param('id')))->map_revision();
      //look for url map saves
	    WaxEvent::run('cms.url.add', $obj);
	    WaxEvent::run('cms.joins.handle', $obj);
      WaxEvent::run('cms.file.tag', $obj);
	    //checking for cicular references..
	    WaxEvent::run("cms.save.sanity_check", $obj);
  	  WaxEvent::run("cms.save.success.finished", $obj);
  	  if($obj->use_layout) $obj->redirect_to("/".trim($obj->controller,"/")."/edit/".$obj->model->primval."/");
    });
    //modify the post filter function to enforce a status filter - they bubble..
    WaxEvent::add("cms.model.filters", function(){
      $obj = WaxEvent::data();;
      if(!isset($obj->model_filters['language']) && $obj->model && $obj->model->columns['language']){
        $obj->model_filters['language'] = array_shift(array_keys($obj->model->columns['language'][1]['choices']));
        $obj->model->filter("language",  $obj->model_filters['language']);
      }
    });

    WaxEvent::clear("cms.index.setup");
    WaxEvent::add("cms.index.setup", function(){
	    $obj = WaxEvent::data();;
	    //if the parent filter isn't set, then
	    if(!strlen($obj->model_filters['parent'])) $obj->cms_content = $obj->model->filter('revision',0)->roots();
	    else $obj->cms_content = $obj->model->all();
    });

    WaxEvent::clear("cms.model.copy");
    WaxEvent::add("cms.model.copy", function(){
	    $obj = WaxEvent::data();
	    $destination_model = $obj->source_model->copy();
      if($changes = Request::param('change')) $destination_model->update_attributes($changes);
      if($destination_model) $destination_model->map_revision();
      $obj->redirect_to("/".trim($obj->controller,"/")."/edit/".$destination_model->primval."/");
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

  public function tidy(){
    set_time_limit(0);
    //remove everything thats draft
    $model = new $this->model_class;
    echo strtoupper($this->model_class).":<br>";
    echo "draft:<br>";
    foreach($model->filter("status", 0)->all() as $remove){
      echo "[$remove->primval] $remove->title: $remove->permalink<br>\n";
      //find all mappings related to this model
      $map = new WildfireUrlMap;
      foreach($map->clear()->filter("destination_model", $this->model_class)->filter("destination_id", $remove->primval)->all() as $url){
        echo "--> (url) [$url->primval] $url->origin_url<br>\n";
        $url->delete();
      }
      foreach($map->clear()->filter("destination_url", $remove->permalink)->filter("status", 0)->all() as $url){
        echo "--> (url) [$url->primval] $url->origin_url<br>\n";
        $url->delete();
      }
      //go over joins
      foreach($remove->columns as $column => $data){
        if($data[0] == "ManyToManyField"){
          foreach($remove->$column as $joined){
            echo "--> ($column) [$joined->primval] ".$joined->humanize()."<br>\n";
            $remove->$column->unlink($joined);
          }
        }
      }
      $remove->delete();
      echo "<hr>\n\n";
    }    
    echo "live:<br>";
    //go over the live ones and call url mapping on them
    foreach($model->clear()->scope("live")->all() as $live){
      echo "[$live->primval] $live->title: $live->permalink<br>\n";
      $live->generate_permalink()->map_live();
    }
    
    echo "children:<br>";
    //go over everything that has a child and make sure its in the right place..
    foreach($model->clear()->filter("parent_id > 0")->all() as $row){
      echo "[$row->primval] $row->title: $row->permalink : $row->parent_id<br>\n";
      $tmp = new $this->model_class($row->parent_id);
      if($tmp->primval == $row->parent_id) echo "ok";
      else{
        //so trim off the last part of the url
        $sub = substr($row->permalink,0,-1);
        $parent = substr($sub, 0, strrpos($sub, "/")+1);
        echo "--> parent:".$parent."<br>";
        $p = new $this->model_class("live");
        if($found = $p->filter("permalink", $parent)->first()) $row->update_attributes(array('parent_id'=>$found->primval));
      }
      echo "<hr>";
    }
    echo "end<hr>";
    $this->use_layout = $this->use_view = false;
  }



}
?>
