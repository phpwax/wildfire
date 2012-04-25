<?
//controller for displaying media
class MController extends WaxController{

  //should accept either all or part of the hash column to show the file, this is what show will be used for
  public function method_missing(){
    $options = WaxUrl::$params;
    if($s = $options['id']) $size = $s;
    else $size = false;
    $hash = $options['action'];
    $length = strlen($hash);
    $model = new WildfireMedia("live");
    if($length == 40) $model->filter("hash", $hash);
    elseif($length >= 6) $model->filter("hash LIKE '$hash%'");
    else $model->filter("1=2");
    $found = $model->first();
    if($found) $found->show($size);
    exit;
  }

  //to loop over all media records and run a render on them, 1 every 5 seconds on the sizes set in config
  public function pre_render(){
    set_time_limit(0);
    ini_set('memory_limit','512M');
    $sizes = array_merge(array(40,200), (array) Config::get("media_sizes"));
    $model = new WildfireMedia;
    foreach($model->filter("file_type LIKE '%image%'")->filter("pre_rendered",0)->limit(1)->order("date_created ASC")->all() as $media){
      if(!$media->ext) $media->update_attributes(array('ext'=>end(explode('.', $media->source))));
      foreach($sizes as $size){

        $file = CACHE_DIR."images/".$media->hash."/".$size.".".$media->ext;
        if(is_readable($file)) unlink($file);
        echo "rendering $media->title @ $size ($file)<br>\r\n";
        echo $media->render($size) ."<hr>\r\n";
        sleep(5);
      }
      $media->update_attributes(array('pre_rendered'=>1));
    }
    exit;
  }

}
?>