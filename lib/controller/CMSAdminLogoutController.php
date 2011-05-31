<?
class CMSAdminLogoutController extends CMSBaseComponent{
  
  public $model_class = "WildfireUser";
  public $model_scope = false;
  
  public function index(){
    $this->session->unset_var($this->user_session_var_name);
    $this->redirect_to($this->redirects['unauthorised']);
  }
  
  
  
}
?>