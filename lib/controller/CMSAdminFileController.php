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
	public $filter_fields=array(
                          'text' => array('columns'=>array('id', 'path', 'rpath', 'filename'), 'partial'=>'_filters_text', 'fuzzy'=>true),
                          'folder' => array('columns'=>array('path'), 'partial'=>'_filters_folder', 'fuzzy_right'=>true),
	                      );


  protected function events(){
    parent::events();
    WaxEvent::clear("cms.layout.sublinks");
    WaxEvent::add("cms.layout.sublinks", function(){
      $obj = WaxEvent::data();
      $obj->quick_links = array();
    });
    
  }

  public function index(){
    parent::index();
    WaxEvent::run('cms.file.old_upload', $this);
  }

	public function _list(){
	  $this->files = array();
	  if($this->dir = Request::param('dir')){
	    if(Request::param('sync')) $this->sync($this->dir);
	    $file = new $this->model_class($this->model_scope);
	    if(!is_dir(PUBLIC_DIR . $this->dir)) mkdir(PUBLIC_DIR . $this->dir, 0777, true);
	    foreach(new RegexIterator(new DirectoryIterator(PUBLIC_DIR.$this->dir), "#^[^\.]#i") as $file) $this->files[] = basename($file->getPathName());
	    $this->files = array_reverse((array)$this->files);
	    asort($this->files);
	  }
	}

  public function _search(){
    $this->cms_content = $this->model->scope("available")->all();
  }

	public function _info(){
	  if($filename = Request::param('file')){
	    $file = new $this->model_class($this->model_scope);
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

  public function move() {
    $origin = post("origin_dir");
    $file = basename(post("origin_file"));
    $f = WildfireFile::find("first",array("filter"=>array("rpath = ? AND filename=?",array($origin,$file))));
    $destination = post("destination");
    $f->rpath = $destination;
    $f->path = $destination;
    if($f->save()) {
      echo $f->id;
			exit;
    }
    
  }
  
  public function edit() {
    $this->image = new WildfireFile(get("id"));
    if(post("operation")=="crop") {
      $location = PUBLIC_DIR. $this->image->url();		
			File::crop_image($location, $location, post("x1"), post("y1"), post("w"), post("h"));
			File::clear_image_cache($this->image->id);
			echo $this->image->id;
			exit;
    }
  }
  

  

}
?>
