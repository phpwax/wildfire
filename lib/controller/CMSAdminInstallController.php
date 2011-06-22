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
      $this->session->set($this->user_session_var_name, $saved->primval);
      if(($goto = $this->session->get('wf_referer')) && $goto != "/admin/login") $this->redirect_to($goto);
      else $this->redirect_to($this->redirects['authorised']);
    }
  }

  /*convert old cms to new cms*/
  public function convert(){
    $new_check = new WildfireContent;
    if($new->first()){
      Session::add_message("Content present, presuming converted already");
      $this->redirect_to("/admin/home/");
    }else{
      //convert users
      if($this->convert_users()) Session::add_error("User conversion complete");
      else Session::add_error("User conversion failed");
      //convert sections
      if($sections = $this->convert_sections()) Session::add_error("Section conversion complete");
      else Session::add_error("Section conversion failed");
      //convert content
      if($this->convert_content($sections)) Session::add_error("Content conversion complete");
      else Session::add_error("Content conversion failed");
    }

  }
  /* copy over old users to new users */
  public function convert_users(){
    $old = new WaxModel;
  }
  /* move sections over to new tree content */
  public function convert_sections(){
    
  }
  /* move over to new tree content */
  public function convert_content($sections){
    
  }

}
?>