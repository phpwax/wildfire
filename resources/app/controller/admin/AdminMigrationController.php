<?php
class AdminMigrationController extends AdminComponent {
  public $use_layout = false;
  public $use_view = false;

  public function events(){
    parent::events();
    WaxEvent::clear("cms.model.setup"); //skip model setup, this won't need a model
  }
  
  // v7 introduced media, this migrates <= v6 files into >= v7 media
  public function files_to_media(){
    echo "<h1>Importing Files</h1>";
    $old_files = new WaxModel;
    $old_files->table = "wildfire_file";
    $old_files = $old_files->all();

    $id_mapping = array();

    foreach($old_files as $file){
      $pathinfo = pathinfo($file->filename);
      $disk_relative_path = "$file->path/$file->filename";
      echo "<p>Trying $disk_relative_path, ";

      $media = new WildfireMedia;

      $media->media_class = "WildfireDiskFile";
      $media->title = $pathinfo['filename'];
      $media->ext = $fileinfo['extension'];
      $media->source = $disk_relative_path;
      $media->uploaded_location = $disk_relative_path;
      $media->hash = hash_hmac('sha1', $data, md5(file_get_contents($disk_relative_path)));
      $media->media_type = "WildfireDiskFile";
      $media->user = $this->current_user->id;
      $media->file_type = File::detect_mime($disk_relative_path);

      if($stats = stat($disk_relative_path)){
        echo "found on disk, ";
        $media->date_created = date('c',$stats['mtime']);
        $media->date_modified = date('c',$stats['ctime']);
        $media->status = 1;
      }

      if($media->save()){
        echo "saved to media, attached to ";
        $id_mapping[$file->id] = $media->id;
        foreach($file->pages as $content){
          $media->pages = $content;
          echo "$content->id, ";
        }
      }

      echo "</p>";
    }
    exit;
  }

  public function find_inline_images($id_mapping){
    $c = new WildfireContent;
    foreach($c->all() as $d){
      foreach($id_mapping as $old => $new){
        $pos = strpos($c->content, $old);
      }
    }
    exit;
  }
}
