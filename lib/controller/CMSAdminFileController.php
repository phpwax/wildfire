<?php
/**
* Class giving an admin interface to manipulate files
* @package PHP-WAX CMS
*/

class CMSAdminFileController extends AdminComponent {
	public $module_name = "files";
	public $model_class="WildfireFile";
	public $model_scope = "available";
	public $display_name = "Files";


  protected function events(){
    parent::events();
    WaxEvent::clear("cms.layout.sublinks");
    WaxEvent::add("cms.layout.sublinks", function(){
      $obj = WaxEvent::data();
      $obj->quick_links = array();
    });
    WaxEvent::add('cms.file.old_upload', function(){
      $obj = WaxEvent::data();
      if(($up = $_FILES['upload']) && ($dir=Request::param('path'))){
        $path = PUBLIC_DIR.$dir;
        $safe_name = File::safe_file_save($path, $up['name']);
        move_uploaded_file($up['tmp_name'], $path.$safe_name);
        exec("chmod -Rf 0777 ".$path.$safe_name);
        $obj->sync($dir);
      }
    });
  }

  public function index(){
    parent::index();
    WaxEvent::run('cms.file.old_upload', $this);
  }

	public function _list(){
	  $this->files = array();
	  if($this->dir = Request::param('dir')){
	    $this->sync($this->dir);
	    $file = new WildfireFile($this->model_scope);
	    if(!is_dir(PUBLIC_DIR . $this->dir)) mkdir(PUBLIC_DIR . $this->dir, 0777, true);
	    $this->files = array_reverse(scandir(PUBLIC_DIR . $this->dir));
	  }
	}

	public function _info(){
	  if($filename = Request::param('file')){
	    $file = new WildfireFile($this->model_scope);
	    $base = basename($filename);
	    $path = str_replace($base, "", $filename);
      $this->file = $file->filter("rpath", $path)->filter("filename", $base)->first();
	  }
	}

  public function create(){
    $this->use_view=false;
    if(($new = Inflections::to_url(Request::param('folder'))) && ($base = Request::param('path')) ){
      $path = PUBLIC_DIR.trim($base,"/")."/".trim($new,"/");
      if(!is_dir($path) && !is_file($path)) mkdir($path,0777,true);
    }
  }

  public function delete(){
    $this->use_view=false;
    if($file = Request::param('file')){
      $path = PUBLIC_DIR.$file;
      if(is_readable($path)){
        $name = basename($path);
        $rpath = str_replace($name, "", $file);
        $model = new $this->model_class;
        unlink($path);
        foreach($found = $model->filter("rpath", $rpath)->filter("filename", $name)->all() as $f) $f->delete();
      }
    }
    if($file = Request::param('dir')){
      $path = rtrim(PUBLIC_DIR.$file."/", "/")."/";
      if(is_readable($path)){
        exec('rm -Rf "'.$path.'"');
        $model = new $this->model_class;
        $name = basename($path);
        $rpath = rtrim($file, "/")."/";
        foreach($found = $model->filter("rpath", $rpath)->all() as $f) $f->delete();
      }
    }
  }


  

}
?>
