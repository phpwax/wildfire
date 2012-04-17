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

    foreach($old_files as $file){
      $pathinfo = pathinfo($file->filename);
      // echo "<pre>".print_r($pathinfo, 1)."</pre>";
      $disk_relative_path = "$file->rpath$file->filename";
      echo "<p>Trying $disk_relative_path, ";

      if($existing = WildfireMedia::find_first_by_migration_id($file->id)) $media = $existing;
      else $media = new WildfireMedia;

      $media->migration_id = $file->id;
      $media->media_class = "WildfireDiskFile";
      $media->title = $pathinfo['filename'];
      $media->ext = $fileinfo['extension'];
      $media->source = $disk_relative_path;
      $media->uploaded_location = $disk_relative_path;
      if($data = file_get_contents(PUBLIC_DIR.$disk_relative_path)) $media->hash = hash_hmac('sha1', $data, md5($data));
      else $media->hash = "";
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
        $content_joins = new WildfireContent;
        $content_joins->left_join("wildfire_content_wildfire_file");
        $content_joins->join_condition("wildfire_content_wildfire_file.wildfire_content_id = wildfire_content.id");
        $content_joins->filter("wildfire_content_wildfire_file.wildfire_file_id", $media->migration_id);
        $content_joins->select_columns = array("wildfire_content.id, wildfire_content_wildfire_file.*");
        $content_joins = $content_joins->all();
        foreach($content_joins as $content){
          $media->pages->unlink($content);
          $media->pages = $content;
          echo "$content->id, ";
        }
      }

      echo "</p>";
    }
    echo "<h2>done</h2>";
    exit;
  }

  public function inline_files_to_media(){
    set_time_limit(0);

    $c = WildfireContent::find("all");
    $m = WildfireMedia::find("all", array("filter"=>array("migration_id IS NOT NULL AND status = 1")));
    
    $mapping = array();
    foreach($m as $media) $mapping[$media->migration_id] = substr($media->hash, 0, WildfireDiskFile::$hash_length);

    foreach($c as $content){
      foreach($mapping as $source => $dest) $content->content = str_replace("/show_image/$source/", "/m/$dest/", $content->content);
      $content->save();
      echo "<p><a href='$content->permalink'>$content->title</p>";
      flush();
    }
    exit;
  }
}
