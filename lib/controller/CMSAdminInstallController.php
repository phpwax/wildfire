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
    $new_check = new WaxModel;
    $res = $new_check->query("SHOW TABLES LIKE '%wildfire_content%';")->fetchAll();
    // if(count($res)){
    //   Session::add_message("Content present, presuming converted already");
    //   $this->redirect_to("/admin/home/");
    // }else{
      // //convert users
      // if($this->convert_users()) Session::add_error("User conversion complete");
      // else Session::add_error("User conversion failed");
      //convert all content over
      if($sections = $this->convert_content()) Session::add_error("Content conversion complete");
      else Session::add_error("Content conversion failed");

    //}

  }
  /* copy over old users to new users */
  protected function convert_users(){
    $u = new WildfireUser;
    $old = $u->all();
    foreach($old as $user) $user->update_attributes(array('password'=>md5($user->password)));
    return true;
  }

  /* move over to new tree content */
  protected function convert_content(){
    $m = new WildfireCategory;
    $m->syncdb();
    $m = new WildfireFile;
    $m->syncdb();
    $m = new WildfireContent;
    $m->syncdb();
    $m = new WildfireUrlMap;
    $m->syncdb();
    
    $old = new WaxModel;
    foreach($old->query("SELECT * FROM `cms_category`")->fetchAll() as $j){
      $cat = new WildfireCategory;
      $cat->update_attributes(array('title'=>$j['name']));
    }    
    
    $old = new WaxModel;
    $res = $old->query("SELECT * FROM `cms_section` WHERE `parent_id`=0 ORDER BY id ASC")->fetchAll();
    //so we start at the top...
    foreach($res as $root){
      $this->traverse($root,0,0);
    }
    exit;
  }

  protected function traverse($section, $parent=0, $depth=0){
    echo str_pad("", ($depth)*12, "&nbsp;")."$section[title]:<br>";
    $new_parent_id = 0;
    //now we create a new content item for this section
    if(strtolower($section['title']) != "home" && $section['url'] != "home"){
      $node = new WildfireContent;
      $node->title = $section['title'];
      $node->content = $section['introduction'];
      $node->parent_id = $parent;
      $node->old_id = $section['id'];
      $saved = $node->save()->generate_permalink()->map_live()->show()->save();
      $new_parent_id = $saved->primval;
    }
    //now find all content pages underneath this that are turned on
    $old = new WaxModel;
    $res = $old->query("SELECT * FROM `cms_content` WHERE `status` IN (1,0) AND `cms_section_id`=".$section['id'])->fetchAll();
    foreach($res as $content){
      echo str_pad("", ($depth+1)*12, "&nbsp;")."$content[title]:<br>";
      $node = new WildfireContent;
      $node->syncdb();
      $info = array('title'=>$content['title'],
                    'content'=>$content['content'],
                    'date_start'=>$content['published'],
                    'date_end'=>$content['expires'],
                    'date_modified'=>$content['date_modified'],
                    'date_created'=>$content['date_created'],
                    'wildfire_user_id'=>$content['author_id'],
                    'status'=>$content['status'],
                    'parent_id'=>$new_parent_id,
                    'meta_description'=>$content['meta_description'],
                    'meta_keywords'=>$content['meta_keywords'],
                    'old_id'=>$content['id']
                    );
      $saved = $node->update_attributes($info)->generate_permalink()->map_live()->show()->save();
      //now do file and category joins
      $mo = new WaxModel;
      $fj = $mo->query("SELECT * FROM `cms_content_wildfire_file` WHERE `cms_content_id`='".$content['id']."'")->fetchAll();
      echo str_pad("", ($depth+1)*12, "&nbsp;")."files (".count($fj)."):<br>";
      foreach($fj as $join){
        $file = new WildfireFile($join['wildfire_file_id']);
        echo str_pad("", ($depth+2)*12, "&nbsp;").$file->filename."<br>";
        if(strstr($file->type, "image")) $type = "image";
        else $type = "document";
        $saved->file_meta_set($join['wildfire_file_id'], $type,$join['join_order']);
      }
      
      $cats = $mo->query("SELECT * FROM `cms_category_cms_content` WHERE `cms_content_id`='".$content['id']."'")->fetchAll();
      echo str_pad("", ($depth+1)*12, "&nbsp;")."categories (".count($fj)."):<br>";
      foreach($cats as $join){
        $cat = new WildfireCategory($join['cms_category_id']);
        echo str_pad("", ($depth+2)*12, "&nbsp;").$cat->title."<br>";
        $saved->categories = $cat;
      }
    }
    //now look for child sections
    $sql="SELECT * FROM `cms_section` WHERE `parent_id`=".$section['id'];
    $sec = $old->query($sql)->fetchAll();
    foreach($sec as $sub){
      echo str_pad("", ($depth+1)*12, "&nbsp;")."kids:<br>";
      $this->traverse($sub,$new_parent_id,$depth+1);
    }
  }

}
?>