<?
class CMSAdminInstallController extends CMSBaseComponent{

  public $model_class = "WildfireUser";
  public $model_scope = "";

  public function index(){
    $model = new $this->model_class($this->model_scope);
    $this->form = new WaxForm($model);
    if($model->all()->count()) throw new WXRoutingException("Error", "Error", "404");
    else if($saved = $this->form->save()){
      
      //setup session
      Session::set($this->user_session_name, $saved->primval);
      if(($goto = Session::get('wf_referer')) && $goto != "/admin/login") $this->redirect_to($goto);
      else $this->redirect_to($this->redirects['authorised']);
    }
  }

}
?>