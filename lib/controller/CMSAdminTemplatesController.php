<?
class CMSAdminTemplatesController extends CMSBaseComponent{
  
  public $model_class = false;
  public $model_scope = false;
  
  public function method_missing(){
    $this->use_layout = "templates";
    $this->use_view = $this->action;
  }
  
  
  
}
?>