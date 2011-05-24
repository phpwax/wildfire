<?
class CMSAdminLoginController extends CMSBaseComponent{
  
  public $model_class = "WildfireUser";
  public $model_scope = false;
  
  public function index(){
    //if($this->user_from_session($this->user_session_name)) $this->redirect_to($this->redirects['authorised']);    
    $model = new $this->model_class($this->model_scope);
    $this->form = new WaxForm($model);
    if(!$model->all()->count()) $this->redirect_to($this->redirects['install']);
    
    if($model->is_posted() && ($post = Request::param($model->table)) && $post['username'] && $post['password']){
      if($found = $model->filter("password", md5($post['password']))->filter("username", $post['username'])->first() ){        
        Session::set($this->user_session_name, $found->primval);
        if(($goto = Session::get('wf_referer')) && $goto != "/admin/login") $this->redirect_to($goto);
        elseif($this->use_format == "html" || !$this->use_format) $this->redirect_to($this->redirects['authorised']);
        
      }else Session::add_error("Could not login with those details.");
    }elseif($model->is_posted()) Session::add_error("Could not login with those details.");
  }
  
  
  
}
?>