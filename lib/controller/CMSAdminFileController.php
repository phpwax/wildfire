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
    if(($new = Request::param('folder')) && ($base = Request::param('path')) ){
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

  public function upload(){
    $this->use_view= false;
    $rpath = $_SERVER['HTTP_X_FILE_PATH'];
    $path = PUBLIC_DIR. $rpath;
    $filename = File::safe_file_save($path, $_SERVER['HTTP_X_FILE_NAME']);
    $putdata = fopen("php://input", "r");
    $put = "";
    while ($data = fread($putdata, 2048)) $put .= $data;
    file_put_contents($path.$filename, $put);
    chmod($path.$filename, 0777);
    $this->sync($rpath);
    exit;
  }

  public function sync($path){
    $model = new $this->model_class;
    //check existing db entries
    foreach($model->filter("rpath", $path)->all() as $file){
      $full_path = PUBLIC_DIR.$file->rpath.$file->filename;
      if(!file_exists($full_path)) $file->update_attributes(array('status'=>'lost'));
    }
    //check filesystem files
    foreach(glob(PUBLIC_DIR.$path."*") as $file){
      chmod($file, 0777);
      $stats = stat($file);
      $fileid = $stats[9];
      $check = new $this->model_class($fileid);
      if(!$found = $model->filter("id", $fileid)->first() && is_file($file)) $this->add_file($path, basename($file), $path, $fileid);
      elseif($found->filename != basename($file)){
        touch($file, time() - rand(3600, 9000));
        $ts = date("YMdHis") - rand(3600, 9000);
        exec('touch -t '+$ts+ ' '+$file);
        $stats = stat($file);
        $fileid = $stats[9];
        if(is_file($file)) $this->add_file($path, basename($file), $path, $fileid);
      }
    }
  }

  protected function add_file($folderpath,$filename,$rpath,$fileid){
    $folderpath = rtrim($folderpath, "/");
    if(function_exists('finfo_file')) {
      $finfo = finfo_open(FILEINFO_MIME_TYPE); // return mime type ala mimetype extension
      $type = finfo_file($finfo, "$folderpath/$filename");
      finfo_close($finfo);
    }elseif(function_exists('mime_content_type') ){
  		$type = mime_content_type("$folderpath/$filename");
  	}else{
  		$type = exec("file --mime -b ".escapeshellarg("$folderpath/$filename"));
  	}
  	$size = filesize($folderpath."/".$filename);
  	$model = new $this->model_class;
  	$query = "INSERT INTO wildfire_file (id,filename,path,rpath,type,size,status) VALUES ($fileid,'".mysql_escape_string($filename)."','$folderpath','$rpath','$type','$size','found')";
    WaxLog::log("error", "[DB] ".$query);
    try{
      if($type != "directory") $res = $model->query($query);
    }catch (Exception $e){}
  }

}
?>
