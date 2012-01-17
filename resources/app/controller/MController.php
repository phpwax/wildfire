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

}
?>