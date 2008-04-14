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
	
	
}
