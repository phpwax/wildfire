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
                          'status' => array('columns'=>array('status'), 'partial'=>"_filters_status"),
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
	    if(($maps = Request::param('url_map')) ){
	      
	      $check = new WildfireUrlMap;
	      foreach($maps as $primval=>$permalink){
	        if($permalink = trim($permalink)){
	          //tidy the url map
	          $permalink = "/".trim($permalink,"/")."/";
	          if(is_numeric($primval)) $model = new WildfireUrlMap($primval);
	          else $model = new WildfireUrlMap();
	          if($check->filter("origin_url", $permalink)->filter('id', $primval, '!=')->first()) Session::add_error('Cannot add url ('.$permalink.'), it is already in use');
	          else if($newmap = $model->map_to($permalink, $saved) ) if(is_numeric($primval)) Session::add_message($permalink.' has been added to your urls.');
          }
	      }
	    }
	  });
	  
	  //overwrite existing events - handle the revision change
	  WaxEvent::add("cms.save.before", function(){
	    $obj = WaxEvent::$data;
	    if(Request::param('revision')){
  	    $obj->model = $obj->model->copy();
  	    $obj->form = new WaxForm($obj->model);
      }
    });
    //if the model is a revision or alt language dont let them edit the parent as this would break the nav
    WaxEvent::add("cms.form.setup", function(){
      $obj = WaxEvent::$data;
      WaxEvent::run('cms.url.delete', $obj);
        
      if($obj->model->revision() || $obj->model->alt_language()) $obj->form->permalink->editable = $obj->form->{$obj->model->parent_column}->editable=false;
      else $obj->form->{$obj->model->parent_column}->choices = $obj->model->allowed_parents();
    });
    
    //status changing after save
    WaxEvent::add("cms.save.success", function(){
	    $obj = WaxEvent::$data;
	    
	    if(Request::param('live')) $obj->model->show()->update_url_map(1);
  	  elseif(Request::param('hide')) $obj->model->hide()->update_url_map(0);
  	  elseif(Request::param('revision')) $obj->model->hide();
  	  //look for url map saves
	    WaxEvent::run('cms.url.add', $obj);
  	  $obj->redirect_to("/".trim($obj->controller,"/")."/edit/".$obj->model->primval."/");
    });
    //modify the post filter function to enforce a status filter - they bubble..
    WaxEvent::add("cms.model.filters", function(){
      $obj = WaxEvent::$data;
      
      if(!isset($obj->model_filters['status'])){
        $obj->model_filters['status'] = array_pop(array_keys($obj->model->columns['status'][1]['choices']));
        $obj->model->filter("status",  $obj->model_filters['status']);
      }
      if(!isset($obj->model_filters['language'])){
        $obj->model_filters['language'] = array_shift(array_keys($obj->model->columns['language'][1]['choices']));
        $obj->model->filter("language",  $obj->model_filters['language']);
      }
    });

    WaxEvent::clear("cms.index.setup");
    WaxEvent::add("cms.index.setup", function(){
	    $obj = WaxEvent::$data;
	    //if the parent filter isn't set, then
	    if(!strlen($obj->model_filters['parent'])) $obj->cms_content = $obj->model->roots();
	    else $obj->cms_content = $obj->model->all();
    });

	}

	protected function initialise(){
	  parent::initialise();
    WaxEvent::run("cms.model.tree",$this);
	}


}
?>
