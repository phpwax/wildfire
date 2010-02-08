<?php

/* Media Processing Cron Jobs */

class Cron {
    
  
  public function process_video($width=false, $height=false, $owner = "apache") {
    if(!$width) $width = "852";
    if(!$height) $height = "480";
    $imgs = new WildfireFile();
    $process_types = array("video/mp4","video/mpg","video/avi", "video/wmv");
    $file = $imgs->filter("type",$process_types)->filter("status","found")->first();
    if($file) {
      echo "Processing ".$file->path.'/'.$file->filename."\n";
      $command = "ffmpeg -i ".$file->path.'/'.$file->filename." -y -qscale 10 -r 25 -ar 44100 -ab 96 -s ".$width."x".$height." -f flv ".$file->path."/".$file->filename.".flv";
  	  system($command, $res);
      if($res !==false) {
        @chown($file->path."/".$file->filename.".flv", $owner);
        @chmod($file->path."/".$file->filename.".flv", 0777);
        if(is_writable($file->path.'/'.$file->filename)) unlink($file->path.'/'.$file->filename);
        $file->filename = $file->filename.".flv";
        $file->type = "video/x-flv";
        if($file->save()) return true;
      }
    }
    return false;
  }
  
  public function image_queue() {
    $queue = new ImageQueue;
    $q = $queue->filter("status","0")->first();
    if(File::resize_image($q->original, $q->destination, $q->size, $q->compression)) {
      $q->status = 1;
      if($q->save()) return true;
    }

  }
  
  
  
  
  
}

