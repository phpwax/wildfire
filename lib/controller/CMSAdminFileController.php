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
	    $files = scandir(PUBLIC_DIR . $this->dir);
	    natcasesort($files);
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

}
?>
