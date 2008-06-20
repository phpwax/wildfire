<?php

class WildfireLog extends WaxModel {
  
    
  public function setup() {
    $this->define("action", "CharField");
    $this->define("user", "ForeignKey", array("target_model"=>"WildfireUser"));
    $this->define("time", "DateTimeField");
  }

	
}

?>