<?php
class CMSAdminRelatedController extends AdminComponent {
  public $module_name = "related";
  public $model_class = 'CmsRelated';
	public $model_name = "cms_related";
	public $display_name = "Related Links";
	public $scaffold_columns = array(
		"source"      =>  array(),
    "title"       =>  array()
  );
  public $filter_columns = array("title");
	public $order_by_columns = array("title");
	public static $permissions = array("create","edit","delete");
	
	public function create(){
	  parent::create();
	  if(Request::param("ajax")){
	    //swallow message
	    $messages = Session::get('user_messages');
	    array_pop($messages);
	    Session::set('user_messages', $messages);
	    
	    $created_model = $this->model;
	    $this->model = new $this->model_class;
	    $this->model->filter(array("source_model"=>$created_model->source_model,"source_id"=>$created_model->source_id));
	    $this->use_view = "_list_table";
	    $this->use_layout = false;
	    $this->index();
	  }
	}

  //had to add this in as the default delete just redirects. redirects being fatal sucks.
	public function delete(){
		$id = Request::get("id");
		if(!$id) $id = $this->route_array[0];
		if($id && ($model = new $this->model_class($id))){
		  $deleted_model = $model;
		  $model->delete();
  	  if(Request::param("ajax")){
  	    $this->model = new $this->model_class;
  	    $this->model->filter(array("source_model"=>$deleted_model->source_model,"source_id"=>$deleted_model->source_id));
  	    $this->use_view = "_list_table";
  	    $this->use_layout = false;
  	    $this->index();
  	  }
	  }
	}
}?>