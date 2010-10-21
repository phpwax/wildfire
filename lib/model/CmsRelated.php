<?php
class CmsRelated extends WaxModel {
  public function setup() {
    $this->define("source_model","CharField", array("required"=>true));
    $this->define("source_id","IntegerField", array("required"=>true));
    
    $this->define("title","CharField");
    $this->define("desc","CharField");
    
    //either a destination internal page/section or a static destination url
    $this->define("dest_model","CharField");
    $this->define("dest_id","IntegerField");
    $this->define("url","CharField");
    
    $this->define("links_order","IntegerField");
  }
  
  //if passed in construction
  public static function fetch($model){
    $ret = new CmsRelated;
    if($model instanceof WaxModel && ($id = $model->primval()))
      $ret->filter(array("source_model" => get_class($model), "source_id" => $id));
    else
      $ret->filter("1 = 2");
    return $ret;
  }
    
  public function dest(){ return $this->dest_model($this->dest_id); }
    
  public function url(){
    if($url = $this->url) return $url;
    return $this->dest()->permalink();
  }
}?>