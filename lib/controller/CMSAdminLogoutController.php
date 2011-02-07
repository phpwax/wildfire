<?
class CMSAdminLogoutController extends AdminComponent{
  
  public $model_class = "WildfireUser";
  public $model_scope = false;
  
  public function index(){
    Session::unset_var($this->user_session_name);
    $this->redirect_to($this->redirects['unauthorised']);
  }
  
  
  
}
?>