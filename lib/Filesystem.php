<?php

/* New Model */

class Filesystem {
  
  public $root_dir=false;
  public $root_name = "Your Folder";
  public $file_model = "WildfireFile";
  public $ajax_render = true;
  
  public function __construct($dir=false) {
    if(!$dir && !$this->root_dir) $this->root_dir = PUBLIC_DIR."files/";
    else $this->root_dir = $dir;
  }
  
  public function render($path=false) {
    if($this->ajax_render) return $this->ajax_render();
    if(!$path) {
      //open master ul
      $output .= '<ul class="filesystem"><li class="dir root_dir" rel="/"><a href="#" class="expander root_expander">&nbsp;</a>'.$this->root_name."</a><ul>";
      $it = new RecursiveDirectoryIterator($this->root_dir);
    } else $it = new RecursiveDirectoryIterator($this->root_dir.$path);
    $rit = new RecursiveIteratorIterator($it, 1);
    $current_depth =  $rit->getDepth();
    foreach($rit as $file) {
      if($rit->getDepth() < $current_depth) {
        $output .= "</ul></li>";
      }
      $output .="<li rel='{$this->get_rpath($file->getPathname())}' class='{$file->getType()}";
      if($file->isFile()) $output .=" {$this->get_extension($file->getFilename())}";
      $output.= "'>";
      if($file->isDir()) $output.="<a href='#' class='expander'>&nbsp;</a><span class='dirname'>";
      $output .=$file->getFilename();
      if($file->isDir()) $output .="</span><ul>";
      else $output.="</li>";
      $current_depth = $rit->getDepth();
    }
    if(!$path) $output .= '</ul></li></ul></ul></li></ul>';
    return $output;
  }
  
  public function ajax_render() {
    $output .= '<ul class="filesystem"><li class="dir root_dir" rel="/"><a href="#" class="expander root_expander">&nbsp;</a>'.$this->root_name."</a><ul>";
    $output .= $this->folder_render("");
    $output .= '</ul></li></ul></ul></li></ul>';
    return $output;
  }
  public function output($file) {
    $output .="<li rel='{$this->get_rpath($file->getPathname())}' class='{$file->getType()}";
    if($file->isFile()) $output .=" {$this->get_extension($file->getFilename())}";
    $output.= "'>";
    if($file->isDir()) $output.="<a href='#' class='expander'>&nbsp;</a><span class='dirname'>";
    $output .=$file->getFilename();
    $output.="</li>";
    return $output;
  } 
  
  public function op($op, $data) {
    return $this->$op($data);
  }
  
  public function folder_render($data) {
    $folder = $data["folder"];
    $it = new DirectoryIterator($this->root_dir.$folder);
    foreach($it as $file) {if(!$file->isDot()) $output.=$this->output($file);}
    return $output;
  }
  
  public function file_info($data) {
    $this->use_layout=false;
    $filename = $data["file"];
    $folder = $data["folder"];
    $files = new WildfireFile;
    $file = $files->filter("filename", $filename)->filter("rpath",$folder)->first();
    if(!$file) {
      $file = new WildfireFile;
      $file->id = WildfireFile::file_id($this->root_dir.$folder.$file);
      $file->filename = $filename;
      $file->rpath = $folder;
      $file->save();
    }
    
  }

  
  
  function get_extension($file) {
		return substr($file, strrpos($file, '.')+1);
	}
	
	function get_rpath($path) {
	  return str_replace($this->root_dir, "", $path);
	}
	
	public function rename_file() {
	  if(!$orig=Request::post("original")) return false;
	  if(!$new=Request::post("new")) return false;
	}
	
	protected function get_file($path) {
	  $file = new $this->file_model();
	}
  
  
  
}

