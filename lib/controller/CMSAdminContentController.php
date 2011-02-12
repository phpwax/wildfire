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
      if($revision = $saved->revision()){
        $primval = $revision;
        $status = 0;
      }else{
        $primval = $saved->primval;
        $status = $saved->status;
      }
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

	  //overwrite existing events - handle the revision change
	  WaxEvent::add("cms.save.before", function(){
	    $obj = WaxEvent::$data;
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
	    
	    if(Request::param('live')) $obj->model->show()->url_map()->save();
  	  elseif(Request::param('hide')) $obj->model->hide()->url_map()->save();
  	  elseif(Request::param('revision')) $obj->model->hide()->update_attributes(array('revision'=>$obj->master->primval));
  	  //look for url map saves
	    WaxEvent::run('cms.url.add', $obj);
  	  $obj->redirect_to("/".trim($obj->controller,"/")."/edit/".$obj->model->primval."/");
    });
    //modify the post filter function to enforce a status filter - they bubble..
    WaxEvent::add("cms.model.filters", function(){
      $obj = WaxEvent::$data;
      if(!isset($obj->model_filters['language'])){
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


  public function _list(){
    if($this->use_format == "ajax") $this->index();
  }

}
?>
