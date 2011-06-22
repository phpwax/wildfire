<?
class CMSAdminLoginController extends CMSBaseComponent{
  
  public $model_class = "WildfireUser";
  public $model_scope = false;
  
  public function index(){
    //if($this->user_from_session($this->user_session_var_name)) $this->redirect_to($this->redirects['authorised']);
    $model = new $this->model_class($this->model_scope);
    $this->form = new WaxForm($model);
    $this->form->submit_text = "Login";
    if(!$model->all()->count()) $this->redirect_to($this->redirects['install']);
    
    if($model->is_posted() && ($post = Request::param($model->table)) && $post['username'] && $post['password']){
      if($found = $model->filter("password", md5($post['password']))->filter("username", $post['username'])->first() ){        
        $this->session->set($this->user_session_var_name, $found->primval);
        if(($goto = $this->session->get('wf_referer')) && $goto != "/admin/login") $this->redirect_to($goto);
        elseif($this->use_format == "html" || !$this->use_format) $this->redirect_to($this->redirects['authorised']);
        
      }else $this->session->add_error("Could not login with those details.");
    }elseif($model->is_posted()) $this->session->add_error("Could not login with those details.");
  }
  
  
  
}
?>