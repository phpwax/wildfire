<?
class CMSAdminInstallController extends CMSBaseComponent{

  public $model_class = "WildfireUser";
  public $model_scope = "";

  public function index(){
    $model = new $this->model_class($this->model_scope);
    $this->form = new WaxForm($model);
    if($model->all()->count()) throw new WXRoutingException("Error", "Error", "404");
    else if($saved = $this->form->save()){
      //exclude functions from waxController
      $wc = new ReflectionClass(new WaxController(false,false));
      $excluded = array("__construct", "__destruct");
      foreach($wc->getMethods() as $m) if($m->isPublic() && ($name = $m->getName()) ) $excluded[]=$name;
      //setup permissions
      foreach(CMSApplication::get_modules() as $module=>$info){
        $cname = "Admin".Inflections::camelize($module, true)."Controller";
        $reflect = new ReflectionClass(new $cname(false,false));
        foreach($reflect->getMethods() as $m){
          if($m->isPublic() && ($name = $m->getName()) && !in_array($name, $excluded)){
            $p = new WildfirePermission;
            $p->update_attributes(array('wildfire_user_id'=>$saved->primval, 'class'=>$module, 'operation'=>$name, 'allowed'=>1));
          }
        }
      }
      //setup session
      Session::set($this->user_session_name, $saved->primval);
      if(($goto = Session::get('wf_referer')) && $goto != "/admin/login") $this->redirect_to($goto);
      else $this->redirect_to($this->redirects['authorised']);
    }
  }

}
?>