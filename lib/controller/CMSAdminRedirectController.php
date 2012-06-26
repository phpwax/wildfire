<?php

class CMSAdminRedirectController extends AdminComponent{

  public $module_name = "redirect";
  public $model_class = 'WildfireUrlMap';
	public $display_name = "Redirects";
  public $dashboard = false;


  protected function events(){
    parent::events();
    //always add in the track_url filter
    WaxEvent::add("cms.model.init", function(){
      $obj = WaxEvent::data();
      $obj->model = new $obj->model_class($obj->model_scope);
      $obj->model->filter("track_url", 1);
    });
    //anything saved in the cms should be track_url=1
    WaxEvent::add("cms.save.before", function(){
      $obj = WaxEvent::data();
      $obj->model->track_url = 1;
    });

  }
}

?>