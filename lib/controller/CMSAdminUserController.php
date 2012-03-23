<?php
/**
 * controller to handle the users - inherits from admin component
 * @package PHP-WAX CMS
 */

class CMSAdminUserController extends AdminComponent {

  public $module_name = "users";
  public $model_class = 'WildfireUser';
	public $display_name = "Admin Users";
	public $dashboard = false;
	public $filter_fields=array(
                          'text' => array('columns'=>array('username', 'firstname', 'surname'), 'partial'=>'_filters_text', 'fuzzy'=>true)
	                      );

	protected function events(){
	  parent::events();
	  //overwrite existing events - handle the revision change
	  WaxEvent::add("cms.save.before", function(){
	    $obj = WaxEvent::data();
	    if($pwd = Request::param('new_password')) $obj->model->password = md5($pwd);
    });
    WaxEvent::add("cms.save.success", function(){
      $obj = WaxEvent::data();
      //permissions, wipe and replace
      $user_id = $obj->model->primval;
      $perm = new WildfirePermissionBlacklist;
      foreach($perm->filter($obj->model->table."_id", $user_id)->all() as $p) $p->delete();
      //standard user permissions
      if($permissions = Request::param('user_permissions')){
        foreach($permissions as $controller=>$actions){
          foreach($actions as $action){
            $block = new WildfirePermissionBlacklist;
            $block->update_attributes(array($obj->model->table."_id"=>$user_id, 'class'=>$controller, 'operation'=>$action));
          }
        }
      }
      //look for sub tree permissions, use the same system
      if($tree = Request::param('user_sub_tree')){
        foreach($tree as $model=>$sections){
          foreach($sections as $primval){
            $block = new WildfirePermissionBlacklist;
            $block->update_attributes(array($obj->model->table."_id"=>$user_id, 'class'=>$model, 'operation'=>"tree", "value"=>$primval));
          }
        }
      }

    });

  }
}
?>