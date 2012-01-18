<?
class CMSAdminMediaController extends AdminComponent{
  public $uploads = true;
  public $dashboard = false;
  public $per_page = false;
  public $preview_hover = true;
  public $module_name = "media";
  public $model_class="WildfireMedia";
  public $model_scope = "live";
  public $display_name = "Media";
  public $filter_fields=array(
                          'text' => array('columns'=>array('title', 'content'), 'partial'=>'_filters_text', 'fuzzy'=>true),
                          'media_type' => array('columns'=>array('media_type'), 'partial'=>'_filters_grouped_column')
                        );
                
  public $operation_actions = array('edit', 'download');
  public function events(){
    WaxEvent::add("cms.model.columns", function(){
      $obj = WaxEvent::data();
      $obj->scaffold_columns['preview'] = true;
    });
    parent::events();
  }
}
?>