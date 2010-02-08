<?php

/*** A Simple Model to handle Image resizing in a job queue */

class ImageQueue extends WaxModel {
  
  public function setup() {
    $this->define("original", "CharField", array("required"=>true));
    $this->define("destination", "CharField", array("required"=>true));
    $this->define("size", "IntegerField");
    $this->define("compression", "IntegerField");
    $this->define("status", "IntegerField", array("default"=>0));
  }
  
  
}

