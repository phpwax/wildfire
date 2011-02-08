<?php
/**
* Content Controller
* @package PHP-WAX CMS
*/
class CMSAdminContentController extends AdminComponent {
	public $module_name = "content";											
	public $model_class = 'WildfireContent';
	public $display_name = "Content";
	
	public $filter_fields=array(
                          'text' => array('columns'=>array('title'), 'partial'=>'_filters_text'),
                          'parent' => array('columns'=>array('parent_id'), 'partial'=>'_filters_parent')
	                      );
	
	public function initialise(){
	  parent::initialise();
	  
	  WaxEvent::add("cms.permissions.tree_creation", function() {
      $obj = WaxEvent::$data;
      $model = new $obj->model_class;
	    foreach($model->tree() as $r){ //all sections
    	  $tmp = str_replace("*", "&nbsp;&nbsp;",str_pad("", $r->get_level(), "*", STR_PAD_LEFT));
    	  $obj->possible_parents[$r->primval] = $tmp.$r->title;
      }
    });
    WaxEvent::run("cms.permissions.tree_creation",$this);
    
	}
	
}
?>
