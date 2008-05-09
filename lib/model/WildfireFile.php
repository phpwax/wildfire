<?php

class WildfireFile extends WaxModel {
  

  public $primary_options = array("auto"=>false);
  
  public function setup() {
    $this->define("filename", "CharField");
    $this->define("path", "CharField");
    $this->define("rpath", "CharField");
    $this->define("type", "CharField");
    $this->define("downloads", "IntegerField");
    $this->define("status", "CharField", array(
        "choices"=>array("lost", "found")
      ));
    $this->define("uploader", "IntegerField");
    $this->define("flags", "CharField", array(
        "choices"=>array("hot", "emergency", "normal")
      ));
    $this->define("description", "TextField");
    $this->define("date", "DateTimeField");
    $this->define("size", "IntegerField");
  }
  
  public function find_filter_images($filter, $limit = false) {
    $params = array("conditions"=>"type LIKE '%image%' AND (filename LIKE '%$filter%' OR description LIKE '%$filter%')");
    if($limit) $params['limit']=$limit;
	  return $this->find_all($params);
	}
	
	
}
