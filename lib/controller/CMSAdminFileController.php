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
	    $files = array_reverse(scandir(PUBLIC_DIR . $this->dir));
	    $this->files = $files;
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
    $path = PUBLIC_DIR. $_SERVER['HTTP_X_FILE_PATH'];
    $filename = File::safe_file_save($path, $_SERVER['HTTP_X_FILE_NAME']);    
    $putdata = fopen("php://input", "r");
    $put = "";
    while ($data = fread($putdata, 2048)) $put .= $data;
    file_put_contents($path.$filename, $put);
  }


}
?>
