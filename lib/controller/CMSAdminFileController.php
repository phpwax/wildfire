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

  
  public function upload(){
    $this->use_view = $this->use_layout = false;
    $rpath = $_SERVER['HTTP_X_FILE_PATH'];
    $path = PUBLIC_DIR. $rpath;
    $filename = File::safe_file_save($path, $_SERVER['HTTP_X_FILE_NAME']);    
    $putdata = fopen("php://input", "r");
    $put = "";
    while ($data = fread($putdata, 2048)) $put .= $data;
    file_put_contents($path.$filename, $put);
    chmod($path.$filename, 0777);
    $this->sync($rpath);
  }
  
  protected function sync($path){
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
      if(!$found = $model->filter("id", $fileid)->first()) $this->add_file($path, basename($file), $path, $fileid);
      elseif($found->filename != basename($file)){
        touch($file, time() - rand(3600, 9000));
        $ts = date("YMdHis") - rand(3600, 9000);
        exec('touch -t '+$ts+ ' '+$file);
        $stats = stat($file);
        $fileid = $stats[9];
        $this->add_file($path, basename($file), $path, $fileid);
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
  	$size = filesize($folderpath);
  	$model = new $this->model_class;
  	$query = "INSERT INTO wildfire_file (id,filename,path,rpath,type,size,status) VALUES ($fileid,'".mysql_escape_string($filename)."','$folderpath','$rpath','$type','$size','found')";
    WaxLog::log("error", "[DB] ".$query);
    try{
      $res = $model->query($query);
    }catch (Exception $e){}
  }

}
?>
