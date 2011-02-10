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
                          'text' => array('columns'=>array('title'), 'partial'=>'_filters_text'),
                          'parent' => array('columns'=>array('parent_id'), 'partial'=>'_filters_parent')
	                      );

	protected function events(){
	  parent::events();
	  //custom events
	  WaxEvent::add("cms.index.all", function(){
	    $obj = WaxEvent::$data;
	    $obj->model = $obj->_handle_filters(new $obj->model_class($obj->model_scope), Request::param('filters'));
	    $obj->cms_content = $obj->model->tree();
      //foreach($obj->cms_content as $c) print_r($c);
      //exit;
    });

    WaxEvent::add("cms.permissions.tree_creation", function() {
      $obj = WaxEvent::$data;
      $model = new $obj->model_class;
	    foreach($model->tree() as $r){ //all sections
    	  $tmp = str_replace("*", "&nbsp;&nbsp;",str_pad("", $r->get_level(), "*", STR_PAD_LEFT));
    	  $obj->possible_parents[$r->primval] = $tmp.$r->title;
      }
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
