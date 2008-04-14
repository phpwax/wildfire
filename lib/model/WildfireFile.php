<?php

class WildfireFile extends WaxModel {
  

  public $primary_options = array("auto"=>false);
  
  public function setup() {
    $this->define("filename", "CharField");
    $this->define("path", "CharField");
    $this->define("rpath", "CharField");
    $this->define("downloads", "IntegerField");
    $this->define("status", "CharField");
    $this->define("uploader", "IntegerField");
    $this->define("flags", "CharField");
    $this->define("description", "TextField");
    $this->define("date", "DateTimeField");
    $this->define("size", "IntegerField");
  }
	
	
}
