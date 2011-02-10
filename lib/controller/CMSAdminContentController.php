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
                          'status' => array('columns'=>array('status'), 'partial'=>"_filters_status")
	                      );

	protected function events(){
	  parent::events();
	  //overwrite existing events - handle the revision change
	  WaxEvent::add("cms.save.before", function(){
	    $obj = WaxEvent::$data;
	    if(Request::param('revision')){
  	    $obj->model = $obj->model->copy();
  	    $obj->form = new WaxForm($obj->model);
      }
    });
    //status changing after save
    WaxEvent::add("cms.save.success", function(){
	    $obj = WaxEvent::$data;
	    if(Request::param('live')) $obj->model->show()->update_url_map(1);
  	  elseif(Request::param('hide')) $obj->model->hide()->update_url_map(0);
  	  elseif(Request::param('revision')) $obj->model->hide();
  	  $obj->redirect_to("/".trim($obj->controller,"/")."/edit/".$obj->model->primval."/");
    });
    //modify the post filter function to enforce a status filter - they bubble..
    WaxEvent::add("cms.model.filters", function(){
      $obj = WaxEvent::$data;
      if(!isset($obj->model_filters['status'])){
        $obj->model_filters['status'] = array_pop(array_keys($obj->model->columns['status'][1]['choices']));
        $obj->model->filter("status",  $obj->model_filters['status']);
      }
    });
    
    WaxEvent::clear("cms.index.setup");
    WaxEvent::add("cms.index.setup", function(){
	    $obj = WaxEvent::$data;
	    //if the parent filter isn't set, then
	    if(!isset($obj->model_filters['parent'])) $obj->cms_content = $obj->model->roots();
    });

	}

	protected function initialise(){
	  parent::initialise();
    WaxEvent::run("cms.permissions.tree_creation",$this);
	}


	public function save_before(){
	  //if the parameter is to create a revision by copying the joins over
	  if(Request::param('revision')){
	    $this->model = $this->model->copy();
	    $this->form = new WaxForm($this->model);
    }
	}
	//use the after to check if this was published or not
	public function save_success(){
	  //put this model live if its set to
	  if(Request::param('live')) $this->model->show()->update_url_map(1);
	  elseif(Request::param('hide')) $this->model->hide()->update_url_map(0);
	  elseif(Request::param('revision')) $this->model->hide();
	  $this->redirect_to("/".trim($this->controller,"/")."/edit/".$this->model->primval."/");
	}

}
?>
